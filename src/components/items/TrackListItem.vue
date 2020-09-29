<template>
  <div class="flex flex-col relative track-list-item w-full max-w-md" @click="$emit('click')">
    <div class="flex justify-between">
      <div class="h6">{{ name }}</div>
      <div v-if="durationSec || durationString" class="caption text-dark-500 sm:hidden">{{ duration }}</div>
    </div>
    <AudioTrackBackground class="tli-track opacity-50" :song-colors="songColors || null" />
    <div v-if="releaseDate || ensembleName" class="caption text-dark-500">
      <span v-if="ensembleName" class="mr-sm">{{ ensembleName }}</span>
      <span v-if="releaseDate">{{ formattedReleaseDate }}</span>
    </div>
  </div>
</template>

<script>
import AudioTrackBackground from '@/components/asset/AudioTrackBackground';

export default {
  name: 'TrackListItem',
  components: { AudioTrackBackground },
  props: {
    name: { type: String, required: true },
    durationSec: [Number, String],
    durationString: { type: String, default: '' },
    ensembleName: { type: String, default: '' },
    releaseDate: { type: String, default: '' },
    songColors: { type: [String, Array], default: '' }
  },
  computed: {
    duration() {
      if (!this.durationSec) return '';
      if (this.durationString) return this.durationString;
      const date = new Date(null);
      date.setSeconds(this.durationSec);
      let duration = date.toISOString().substr(11, 8);
      if (duration.split(':')[0] === '00') {
        duration = duration
          .split(':')
          .slice(1)
          .join(':');
      }
      return duration;
    },
    formattedReleaseDate() {
      if (!this.releaseDate) return '';
      return this.$moment(this.releaseDate).format('MMMM D');
    }
  }
};
</script>

<style lang="scss" scoped>
.tli-track {
  position: relative;
  width: 100%;
  height: 14px;
}
</style>
