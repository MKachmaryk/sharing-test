<template>
  <div
    id="toolbelt"
    class="absolute w-full flex justify-between items-center bg-fog-700 border-t border-b border-gray-400 z-20"
  >
    <Button
      class="px-one"
      bg-color="transparent"
      :color="playerIsPlaying ? 'red-500' : 'green-500'"
      :icon="playerIsPlaying ? 'pause' : 'play'"
      :text="playerIsPlaying ? 'PAUSE' : 'PLAY'"
      @click="$eventBus.$emit('handle-external-play')"
    />
    <Button
      class="px-one"
      bg-color="transparent"
      color="blue-500"
      icon="share"
      text="SHARE THIS"
      @click="$emit('toggle-share-tool', true)"
    />
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import { mapState } from 'vuex';

export default {
  name: 'Toolbelt',
  components: { Button },
  props: {
    lowerState: String
  },
  computed: {
    ...mapState(['playerIsPlaying'])
  }
};
</script>

<style lang="scss" scoped>
#toolbelt {
  height: 60px;
}
</style>
