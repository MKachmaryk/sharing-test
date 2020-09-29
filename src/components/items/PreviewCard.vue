<template>
  <div class="playlist-card relative p-4 overflow-hidden flex flex-col items-center justify-between">
    <div class="pc-header w-full flex justify-center mb-4 h2 font-bold">
      {{ projectName.toUpperCase() }}
    </div>
    <div
      class="photo-bg mb-2 flex-none cursor-pointer"
      @click="
        $router.push({
          name: 'asset',
          params: { id: unit.id }
        })
      "
    >
      <img draggable="false" :src="projectImageUrl" />
    </div>
    <div class="w-full flex flex-col">
      <div class="flex items-center w-full">
        <Button
          bg-color="transparent"
          :icon="unitIcon"
          small
          style="margin-left: -4px;"
        />
        <div v-if="unit" class="h6 ml-1 break-word">
          {{ unit.type === 'stream' ? 'LIVE: ' : ''}}{{ unit.name.toUpperCase() }}
        </div>
      </div>
      <div class="h6 mb-2">
        <span>{{ unit.releaseDate.split('-')[0] }}</span>
        <span v-if="unit.type === 'playlist'">
          &nbsp;&#183;&nbsp;{{unit.children.length}} TRACKS
        </span>
        <span v-if="duration">&nbsp;&#183;&nbsp;{{ duration }}</span>
      </div>
    </div>

    <div v-if="unit.type === 'audio'" class="relative w-full h-4 mb-2">
      <AudioTrackBackground        
        class="w-full h-full"
        :song-colors="unit.audio.colors || null"
      />
    </div>
    <div v-if="unit.type === 'playlist'" class="body w-full flex flex-col">
      <div
        v-for="(track, i) in unit.children.slice(0, 3)"
        :key="track.id"
        class="relative mb-1"
      >
        <div class="flex justify-between caption" style="margin-bottom: 1px;">
          <div class="truncate">
            {{ i + 1 }}. {{ track.name }}
          </div>
          <div>
            {{ formatDuration(track.audio.duration) }}
          </div>
        </div>
        <div class="w-full relative h-4">
          <AudioTrackBackground        
            class="w-full h-full opacity-50"
            :song-colors="track.audio.colors || null"
          />
        </div>
      </div>
    </div>
    <!-- <div class="flex justify-end w-full">
      <Button
        text="MORE INFO"
        bg-color="fog-700"
        @click="
          $router.push({
            name: 'asset',
            params: { id: unit.id },
          })
        "
      />
    </div> -->
  </div>
</template>

<script>
import AudioProgressBar from '@/components/asset/AudioProgressBar';
import AudioTrackBackground from '@/components/asset/AudioTrackBackground';
import Button from '@/components/buttons/Button.vue';

export default {
  name: 'PreviewCard',
  components: {
    AudioProgressBar,
    AudioTrackBackground,
    Button,
  },
  props: {
    ensemble: Object,
    projectImageUrl: String,
    projectName: String,
    series: Object,
    unit: Object,
  },
  computed: {
    unitIcon() {
      const options = {
        audio: 'music',
        playlist: 'music',
        image: 'image',
        gallery: 'image-multiple',
        video: 'play',
        stream: 'video',
      }

      return options[this.unit.type];
    },
    duration() {
      function formatDuration(secs) {
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
      }
      try {
        if (this.unit.type === 'playlist') {
          const duration = this.unit.children.reduce(
            (a, b) => a + b.file.audio.duration,
            0
          );
          return formatDuration(duration);
        } else {
          let duration;
          try {
            duration = formatDuration(this.unit.file[this.unit.type].duration);
          } catch (err) {
            duration = '';
          }
          return duration;
        }
      } catch (err) {
        console.log(err);
        return '';
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist-card {
  width: 100%;
  max-width: 500px;
  max-height: 495px;
  background-color: #F7FAFC;
}

.photo-bg {
  position: relative;
  width: 160px;
  height: 160px;
  border: 2px solid #E2E8F0;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
}

</style>