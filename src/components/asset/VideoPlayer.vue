<template>
  <div class="video-player-wrapper">
    <video
      id="videoPlayer"
      ref="videoPlayer"
      class="video-js vjs-default-skin"
      controls
    >
      <source :src="sourceUrl" type="application/x-mpegURL" />
    </video>
  </div>
</template>

<script>
import videojs from 'video.js';

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    sourceUrl: String,
    poster: String,
    wowza: Object,
  },
  data() {
    return {
      player: null,
      videoWidth: 0
    };
  },
  mounted() {
    const videoWidth = this.$store.state.windowWidth <= 960
      ? this.$store.state.windowWidth
      : 800;
    const videoHeight = 9/16 * videoWidth;
    this.options = {
      poster: this.poster,
      aspectRatio: '16:9',
      height: videoHeight,
      sourceURL: this.sourceUrl,
      html5: { hls: { bandwidth: 30000000 } },
    };

    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {
        console.log('onPlayerReady', this);
      }
    );
  },
  beforeDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }
};
</script>

<style lang="scss" scoped>
.video-player-wrapper {
  min-width: 450px;
}
</style>
