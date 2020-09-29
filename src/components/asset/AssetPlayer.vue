<template>
  <div v-if="type == 'video'" class="asset-player">
    <div class="clickable-areas">
      <div class="no-swipe clickable-area" @click="videoClick('back')" />
      <div class="no-swipe clickable-area right-clickable-area" @click="videoClick('forward')" />
      <div
        class="no-swipe clickable-area right-quarter-clickable-area"
        @mousedown="handlePressing"
        @mouseleave="handleMouseUp"
        @mouseup="handleMouseUp"
        @touchstart="handlePressing"
        @touchend="handleMouseUp"
        @touchcancel="handleMouseUp"
      />
    </div>
    <div class="video-wrapper">
      <video
        allowfullscreen
        :poster="unit.imageUrl || unit.image_url"
        :class="{ 'is-playing': this.isPlaying && !this.videoMuted }"
        :muted="videoMuted"
        autoplay
        playsinline
        ref="player"
        @waiting="handleWaiting"
        @seeking="handleSeeking"
        @seeked="handleSeeked"
        @progress="handleProgress"
        @playing="handlePlaying"
        @pause="handlePause"
        @timeupdate="handleTimeUpdate"
        @ended="handleEnded"
        @canplay="handleCanPlay"
        @canplaythrough="handleCanPlayThrough"
        @emptied="handleEmpty"
        @orientationchange="handleOrientationChange"
      >
        <source :src="videoFile" type="video/mp4" />
        <source :src="videoFile" type="video" />
      </video>
      <div class="video-button" />
    </div>
  </div>
  <div v-else class="asset-player">
    <div
      class="audio-scene no-swipe"
      :class="{
        'is-waiting': isWaiting && !isPaused,
        'is-playing': isPlaying
      }"
      style="display: none;"
    >
      <canvas
        class="no-swipe"
        id="phase-scope"
        ref="phase-scope"
        :width="this.canvasDimension"
        :height="this.canvasDimension"
        @click="audioClick"
      />
    </div>

    <div
      v-if="type === 'playlist'"
      ref="scrubber"
      class="scrubber-ref no-swipe"
      style="display: none;"
    />

    <audio
      ref="player"
      crossorigin="anonymous"
      @waiting="handleWaiting"
      @seeking="handleSeeking"
      @seeked="handleSeeked"
      @progress="handleProgress"
      @playing="handlePlaying"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
      @ended="handleEnded"
      @canplay="handleCanPlay"
      @canplaythrough="handleCanPlayThrough"
      @emptied="handleEmpty"
      @stalled="handleWaiting"
      @suspend="handleWaiting"
    />

    <div v-if="type === 'audio'" class="caption">
      <span class="truncate">{{ unit.name }}</span>
      <span style="float:right">
        {{
        formatDuration(unit.file.audio.duration) || ''
        }}
      </span>
      <div
        ref="scrubber"
        class="scrubber scrubber-ref no-swipe"
        :style="'background:' + trackBarColor"
        @touchmove="fingerScrub"
        @click="scrubClick"
        @mousedown="handleMouseDown"
        @mouseleave="handleMouseUp"
        @mouseup="handleMouseUp"
        @mousemove="handleMouseMove($event, true)"
      >
        <AudioTrackBackground :song-colors="unit.file.audio.colors || null" />
        <AudioProgressBar
          :time="currentTime"
          :is-playing="isPlaying"
          :percent-elapsed="percentElapsed"
          :percent-seekable="percentSeekable"
          :color="trackBarColor"
        />
      </div>
    </div>

    <ul
      v-if="type === 'playlist'"
      class="playlist"
      tabindex="-1"
      @keyup.32.prevent="handleTrackClick(currentTrackIndex, unit)"
      @keydown.prevent
    >
      <li
        v-for="(track, index) in $_.sortBy(tracks, 'position')"
        :key="'track--' + index"
        class="playlist-item no-swipe"
        :class="{
          active: currentTrackIndex === index,
          playing: isPlaying && currentTrackIndex === index
        }"
        @click="handleTrackClick(index, unit)"
      >
        <span class="truncate">{{ track.name }}</span>
        <span style="float:right">
          {{
          formatDuration(track.file.audio.duration) || ''
          }}
        </span>
        <div
          class="scrubber no-swipe"
          :class="{
            active: currentTrackIndex === index,
          }"
          :style="'background:' + trackBarColor"
          @touchmove="fingerScrub"
          @click="scrubClick"
          @mousedown="handleMouseDown"
          @mouseleave="handleMouseUp"
          @mouseup="handleMouseUp"
          @mousemove="handleMouseMove($event, currentTrackIndex === index)"
        >
          <AudioTrackBackground :song-colors="track.file.audio.colors || null" />
          <AudioProgressBar
            :time="currentTime"
            :is-playing="isPlaying"
            :percent-elapsed="percentElapsed"
            :percent-seekable="percentSeekable"
            :is-current-track="currentTrackIndex === index"
            :color="trackBarColor"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import AudioTrackBackground from '@/components/asset/AudioTrackBackground';
import AudioProgressBar from '@/components/asset/AudioProgressBar';

export default {
  name: 'AssetPlayer',
  components: {
    AudioTrackBackground,
    AudioProgressBar
  },
  props: {
    spotlight: Object,
    duration: String
  },
  data() {
    return {
      currentTrackIndex: 0,
      currentTime: ['00', '00'],
      isPlaying: false,
      isPlayable: false,
      isPaused: false,
      isWaiting: false,
      percentElapsed: '100%',
      percentSeekable: '0%',
      isLoading: false,
      audioExpected: false,
      delay: 301,
      clicks: 0,
      timer: null,
      canvasDimension: 296,
      scrubbing: false,
      scrollPosition: 0,
      playlistWidths: [],
      audioCtx: {},
      audioWrap: {},
      canvas: {},
      ctx: {},
      videoMuted: true,
      request: null,
      leftBufferLength: 0,
      rightBufferLength: 0,
      leftAnalyser: {},
      rightAnalyser: {},
      leftData: [],
      rightData: [],
      moduleIsVisible: true
    };
  },
  ready() {
    window.addEventListener('resize', this.setCanvasDimension());
  },
  beforeMount() {
    if (this.unit.type === 'playlist') {
      const arr = new Array();
      const trackLength = this.tracks.length;

      // eslint-disable-next-line
      for (var i = 0; i < trackLength; i++) {
        const seconds = this.tracks[i].file.audio.duration;
        arr.push(seconds);
      }
      const longestDuration = parseInt(Math.max.apply(null, arr), 10);
      for (var i = 0; i < trackLength; i++) {
        const pct = (arr[i] * 100) / longestDuration;
        this.playlistWidths.push(pct);
      }
    }
  },
  created() {
    this.$eventBus.$on('handle-external-play', this.handleExternalPlay);
  },
  mounted() {
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    this.$nextTick(() => {
      if (this.type == 'audio' || this.type == 'playlist') {
        // this.setCanvasDimension();
        // this.audioWrap = this.$refs.audioArt;
        // this.audioWrap.addEventListener('touchend', this.activateAudioContext);
        // this.audioWrap.addEventListener('click', this.activateAudioContext);
        // this.canvas = this.$refs['phase-scope'];
        // this.ctx = this.canvas.getContext('2d');
        // this.drawText();
      }
    });
  },
  deactivated() {
    document.body.classList.remove('fullscreen');
    document.body.classList.remove('fullscreen-image');
  },
  beforeDestroy() {
    this.$eventBus.$off('handle-external-play');
  },
  computed: {
    unit() {
      return this.spotlight || this.$store.state.unit;
    },
    trackBarColor() {
      return this.unit.image_colors
        ? this.unit.image_colors.LightMuted
        : '#f3f3f3';
    },
    type() {
      return this.unit.type;
    },
    releaseDate() {
      return this.unit.releaseDate
        ? this.$moment(this.unit.releaseDate).format('MMMM D, YYYY')
        : 'TBD';
    },
    videoFile() {
      return this.unit.asset_url;
    },
    tracks() {
      if (this.type !== 'playlist') return;
      return this.unit.project.bundles[0].units[0].children;
    }
  },
  methods: {
    formatDuration(secs) {
      const date = new Date(null);
      date.setSeconds(secs);
      let duration = date.toISOString().substr(11, 8);
      if (duration.split(':')[0] === '00') {
        duration = duration
          .split(':')
          .slice(1)
          .join(':');
      }
      return duration;
    },
    handleExternalPlay() {
      console.log('handling toolbelt play');
      const { player } = this.$refs;
      const type = this.unit.type;
      if (type === 'audio' || type === 'playlist') {
        this.audioClick();
      } else {
        this.videoClick('forward');
      }
    },
    setCanvasDimension() {
      let dpi = window.devicePixelRatio * 0.75;
      // this.canvasDimension = this.$refs.audioArt.offsetWidth * dpi;
    },
    handleOrientationChange() {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
      if (h > w) {
        document.body.classList.remove('fullscreen');
      } else {
        // landscape
        document.body.classList.add('fullscreen');
      }
      this.setCanvasDimension();
    },
    handleTrackClick(id) {
      const { player } = this.$refs;
      if (this.currentTrackIndex !== id) {
        player.src = this.tracks[id].asset_url;
        this.currentTrackIndex = id;
        this.audioExpected = true;
        this.percentElapsed = '100%';
        this.percentSeekable = '100%';
        player.load();
        player.play();
      } else {
        this.audioExpected = true;
        player.play();
      }
    },
    handleMouseDown(e) {
      this.scrubbing = true;
    },
    handleMouseUp(e) {
      this.scrubbing = false;
    },
    handleMouseMove(e, ok) {
      if (this.scrubbing && ok && this.isPlaying) {
        const audio = this.$refs.player;
        const scrubBar = this.$refs.scrubber;
        var mousePosition =
          (e.pageX - scrubBar.getBoundingClientRect().left) /
          scrubBar.offsetWidth;
        var time = mousePosition * audio.duration;
        audio.currentTime = time;
        this.percentElapsed = `${parseFloat(
          100 - (audio.currentTime / audio.duration) * 100
        )}%`;
      }
    },
    fingerScrub(e) {
      const audio = this.$refs.player;
      const scrubBar = this.$refs.scrubber;
      this.scrubbing = true;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const fingerPosition =
          (e.targetTouches[i].pageX - scrubBar.getBoundingClientRect().left) /
          scrubBar.offsetWidth;
        const time = fingerPosition * audio.duration;
        audio.currentTime = time;
      }
    },
    scrubClick(e) {
      if (this.audioExpected) {
        const audio = this.$refs.player;
        const scrubBar = this.$refs.scrubber;
        const clickPosition =
          (e.clientX - scrubBar.getBoundingClientRect().left) /
          scrubBar.offsetWidth;
        const time = clickPosition * audio.duration;
        audio.currentTime = time;
        this.percentElapsed = `${parseFloat(
          100 - (audio.currentTime / audio.duration) * 100
        )}%`;
      }
    },
    audioClick() {
      console.log('audio click');
      const { player } = this.$refs;
      if (!player.src) {
        if (this.unit.type == 'playlist') {
          player.src = this.tracks[this.currentTrackIndex].asset_url;
        } else {
          player.src = this.unit.asset_url;
        }
        player.load();
      }
      this.scrubbing = false;
      if (this.isPlaying) {
        player.pause();
        this.audioExpected = false;
        this.$store.commit('setPlayerIsPlaying', { bool: false });
      } else {
        player.play();
        this.audioExpected = true;
        this.$store.commit('setPlayerIsPlaying', { bool: true });
      }
    },
    videoClick(origin) {
      const { player } = this.$refs;
      if (player.muted === true) {
        player.currentTime = 0;
        player.muted = false;
        this.videoMuted = false;
      } else {
        player.playbackRate = 1;
        this.scrubbing = false;
        this.clicks++;
        if (this.clicks === 1) {
          const self = this;
          self.timer = setTimeout(() => {
            if (self.isPlaying) {
              player.pause();
              this.$store.commit('setPlayerIsPlaying', { bool: false });
            } else {
              player.play();
              this.$store.commit('setPlayerIsPlaying', { bool: true });
            }
            self.clicks = 0;
          }, self.delay);
        } else {
          // is dbl or NONE??
          clearTimeout(this.timer);
          if (this.isPlaying) {
            if (origin === 'back') {
              player.currentTime -= player.duration * 0.05;
            } else {
              player.currentTime += player.duration * 0.05;
            }
          } else {
            player.play();
            this.$store.commit('setPlayerIsPlaying', { bool: true });
          }
          this.clicks = 0;
        }
      }
    },
    handlePressing() {
      const { player } = this.$refs;
      player.playbackRate = 4;
      this.scrubbing = true;
    },
    handleMouseUp() {
      if (this.scrubbing) {
        const { player } = this.$refs;
        player.playbackRate = 1;
        this.scrubbing = false;
      }
    },
    handleWaiting() {
      this.isPlayable = false;
      this.isWaiting = true;
    },
    handleSeeking() {
      this.isPlayable = false;
      this.isWaiting = true;
    },
    handlePlaying() {
      this.isPaused = false;
      this.isPlayable = true;
      this.isPlaying = true;
      this.$store.commit('setPlayerIsPlaying', { bool: true });
      this.isWaiting = false;
      this.isLoading = false;
    },
    handlePause() {
      this.isPlaying = false;
      this.isPaused = true;
      this.$store.commit('setPlayerIsPlaying', { bool: false });
      this.isWaiting = false;
    },
    handleSeeked() {
      this.isPlayable = true;
    },
    handleProgress() {
      this.isLoading = true;
      const audio = this.$refs.player;
      var duration = audio.duration;
      if (duration > 0) {
        for (var i = 0; i < audio.buffered.length; i++) {
          if (
            audio.buffered.start(audio.buffered.length - 1 - i) <
            audio.currentTime
          ) {
            this.percentSeekable =
              100 -
              (audio.buffered.end(audio.buffered.length - 1 - i) / duration) *
                100 +
              '%';
            break;
          }
        }
      }
    },
    handleTimeUpdate() {
      const audio = this.$refs.player;
      const s = parseInt(audio.currentTime % 60, 10);
      const m = parseInt((audio.currentTime / 60) % 60, 10);
      let readOut = {};
      readOut = [`0${m}`.slice(-2), `0${s}`.slice(-2)];
      this.currentTime = readOut;
      const duration = audio.duration;
      this.percentElapsed = `${parseFloat(
        100 - (audio.currentTime / duration) * 100
      )}%`;
      this.percentSeekable =
        100 -
        (audio.buffered.end(audio.buffered.length - 1) / duration) * 100 +
        '%';
    },
    handleEnded() {
      this.handleNext();
      this.isWaiting = true;
    },
    handleCanPlay() {
      this.isLoading = false;
      this.isWaiting = false;
    },
    handleCanPlayThrough() {
      this.isPlayable = true;
      this.isWaiting = false;
      this.isLoading = false;
    },
    handleEmpty() {
      this.isPlaying = false;
      this.isWaiting = true;
    },
    handleNext() {
      this.isWaiting = true;
      this.audioExpected = true;
      const { player } = this.$refs;
      const count = parseInt(this.tracks.length, 10);
      const nextIndex =
        parseInt(this.currentTrackIndex, 10) + 1 <= count - 1
          ? parseInt(this.currentTrackIndex, 10) + 1
          : 0;
      this.currentTrackIndex = nextIndex;
      player.src = this.tracks[this.currentTrackIndex].asset_url;
      player.load();
      player.play();
      this.percentElapsed = '100%';
      this.percentSeekable = '100%';
    },
    activateAudioContext() {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.audioWrap.removeEventListener('touchend', this.activateAudioContext);
      this.audioWrap.removeEventListener('click', this.activateAudioContext);
      this.audioInit();
    },
    audioInit() {
      this.audio = this.$refs.player;
      const audioSrc = this.audioCtx.createMediaElementSource(this.audio);
      const splitter = this.audioCtx.createChannelSplitter(2);
      this.leftAnalyser = this.audioCtx.createAnalyser();
      this.rightAnalyser = this.audioCtx.createAnalyser();
      this.leftAnalyser.smoothingTimeConstant = 0.8;
      this.rightAnalyser.smoothingTimeConstant = 0.8;

      audioSrc.connect(splitter);
      const merger = this.audioCtx.createChannelMerger(2);
      splitter.connect(this.leftAnalyser, 0, 0);
      splitter.connect(this.rightAnalyser, 1, 0);
      this.leftAnalyser.connect(merger, 0, 0); // input L, output L
      this.rightAnalyser.connect(merger, 0, 1); // input R, output R
      merger.connect(this.audioCtx.destination);

      this.leftBufferLength = this.leftAnalyser.frequencyBinCount;
      this.leftData = new Uint8Array(this.leftBufferLength);

      this.rightBufferLength = this.rightAnalyser.frequencyBinCount;
      this.rightData = new Uint8Array(this.rightBufferLength);
      this.audio.addEventListener('play', this.renderFrame);
      this.audio.addEventListener('pause', this.cancelVisual);
    },
    drawText() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(30, 30);
      this.ctx.lineTo(this.canvas.width - 30, this.canvas.height - 30);
      this.ctx.moveTo(this.canvas.width - 30, 30);
      this.ctx.lineTo(30, this.canvas.height - 30);
      this.ctx.strokeStyle = '#606060';
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.font = '10pt Arial';
      this.ctx.fillText('+L', 12, 24);
      this.ctx.fillText('-L', this.canvas.width - 30, this.canvas.height - 12);
      this.ctx.fillText('+R', this.canvas.width - 30, 24);
      this.ctx.fillText('-R', 12, this.canvas.height - 15);
      this.ctx.fillStyle = '#606060';
      this.ctx.font = '10pt Arial';
      this.ctx.fillText(
        'out of phase',
        this.canvas.width - 100,
        this.canvas.height / 2
      );
      this.ctx.fillText('out of phase', 25, this.canvas.height / 2);
    },
    renderFrame() {
      this.request = window.requestAnimationFrame(this.renderFrame);
      // update data in timeData
      this.leftAnalyser.getByteTimeDomainData(this.leftData);
      this.rightAnalyser.getByteTimeDomainData(this.rightData);
      this.draw();
    },
    draw() {
      let X;
      let Y;
      this.drawText();
      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.rotate((45 * Math.PI) / 180);
      for (let i = 0; i < this.rightBufferLength; i++) {
        X = this.leftData[i] - 128;
        Y = this.rightData[i] - 128;
        if ((X < -10 && Y > 10) || (X > 10 && Y < -10))
          this.ctx.fillStyle = '#ffff00';
        else this.ctx.fillStyle = '#80ff00';
        this.ctx.fillRect(X, Y, 1, 1);
      }
      this.ctx.fill();
      this.ctx.restore();
    },
    cancelVisual() {
      window.cancelAnimationFrame(this.request);
    }
  }
};
</script>

<style lang="scss" scoped>
.asset-player {
  position: relative;
  max-width: 100%;
  overflow-x: scroll;
  padding: 0px 8px;
}
.caption {
  opacity: 0.3;
}
.attr-row {
  margin-bottom: 4px;
}
.clickable-areas {
  width: inherit;
  position: relative;
  overflow-y: hidden;
}
.clickable-area {
  z-index: 2;
  background: transparent;
  touch-action: manipulation;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  height: calc((var(--vh, 1vh) * 50));
  overflow-y: hidden;
  position: absolute;
  top: 0;
  width: 50%;
}
.right-clickable-area {
  left: 50%;
  width: 30%;
  overflow-y: hidden !important;
}
.right-quarter-clickable-area {
  left: 80%;
  width: 20%;
}
.video-button {
  pointer-events: none;
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  display: block;
  z-index: 2;
  transition: opacity 0.2s ease-in-out;
  &:after {
    content: 'SEE';
    position: absolute;
    top: 30%;
    left: 50%;
    margin-left: -38px;
    margin-top: 0;
    border: 1px solid rgba(255, 255, 255, 0.8);
    background: rgba(0, 0, 0, 0.4);
    padding: 10px var(--global-padding);
    text-align: center;
    color: white;
    z-index: 2;
    display: block;
    opacity: 1;
  }
}
.is-playing + .video-button {
  opacity: 0;
}
.audio-metadata {
  padding-bottom: 10px;
  padding-left: 60px;
}
.audio-scene {
  position: relative;
  -webkit-backface-visibility: hidden;
  z-index: 3;
  display: block;
}
canvas#phase-scope {
  position: absolute;
  z-index: 2;
  background: black;
  transform-origin: top left;
  width: 50px;
  border-radius: 50%;
  top: -59px;
  left: 0px;
  display: block;
  border: 1px solid rgba(127, 127, 127, 0.4);
}

.scrubber {
  cursor: pointer;
  text-align: left;
  position: relative;
  z-index: 1;
  display: block;
  height: 14px;
  width: 100%;
  margin-bottom: 10px;
  transition: margin-bottom 200ms ease-in-out;
}
.scrubber.active {
  margin-bottom: 25px;
}

.playlist-item {
  position: relative;
  color: black;
  span {
    pointer-events: none;
  }
}
ul {
  height: 100%;
  // padding-left: 10px;
  list-style-type: none;
}
.playlist {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  li {
    font-size: 14px;
  }
}

video {
  width: 100%;
  max-width: 560px;
  height: auto;
}
</style>
