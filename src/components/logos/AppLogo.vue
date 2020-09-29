<template>
  <div v-if="copy" class="app-logo" @click="$emit('click')">
    <MotiveLogoIcon class="mr-1" :small="small" />
    <div :class="{ 'pb-xs': !small }">
      <div :class="[textSize, 'text-black', 'mb-0']">{{ copy.app_name }}</div>
      <div v-if="!small" class="caption text-dark-500">
        {{ copy.app_subtitle }}
      </div>
    </div>
  </div>
</template>

<script>
import MotiveLogoIcon from '@/components/logos/MotiveLogoIcon.vue';
import { mapState } from 'vuex';

export default {
  name: 'AppLogo',
  components: {
    MotiveLogoIcon
  },
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['copy']),
    size() {
      return this.small ? 'small' : 'default';
    },
    textSize() {
      return this.small ? 'h4-mobile' : 'h2-mobile';
    }
  }
};
</script>

<style lang="scss" scoped>
.app-logo {
  display: flex;
}
</style>
