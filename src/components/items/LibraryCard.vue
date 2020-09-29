<template>
  <div class="library-card p-3 w-full">
    <div class="lc-main flex justify-between" :class="{ 'mb-2': expanded }" @click="toggleExpansion">
      <div class="flex mr-1">
        <Avatar
          class="flex-none"
          size="xl"
          square
          :src="imageUrl"
        />
        <div class="lc-title ml-2">
          <div class="text-lg md:text-xl">
            {{ name }}
          </div>
          <div class="h6">
            By {{ project.ensemble.name }}
          </div>
        </div>
      </div>
      <div class="flex-none caption text-dark-500 self-end">
        {{ playlist.children.length }} Tracks
      </div>
    </div>
    <transition
      name="toggle-item"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
    <template v-if="isExpanded">
    <LibraryTable class="toggle-item" :items="tableItems" />
    </template>
    </transition>
  </div>
</template>

<script>
import Avatar from '@/components/items/Avatar.vue';
import LibraryTable from '@/components/items/LibraryTable.vue';
import toggleExpansion from '@/helpers/toggle-expansion';

export default {
  name: 'LibraryCard',
  mixins: [toggleExpansion],
  components: { Avatar, LibraryTable },
  props: {
    name: String,
    imageUrl: String,
    playlist: Object,
    project: Object,
  },
  data() {
    return {
      expanded: true,
    }
  },
  computed: {
    tableItems() {
      return this.playlist.children.map(c => ({ ...c, project: this.project }));
    }
  }
};
</script>

<style lang="scss" scoped>
.library-card {
  border-bottom: 1px solid lightgray;
}
</style>
