<template>
  <div id="library-page" class="p-8 h-full overflow-y-scroll max-w-screen-lg mx-auto">
    <div class="h1 mb-lg">
      Library
    </div>
    <div v-if="format === 'bundles'" class="lp-main">
      <LibraryCard
        v-for="(sale, i) in bundles"
        :key="`item-${sale.id}-${i}`"
        :name="sale.bundle.name"
        :image-url="sale.bundle.imageUrl"
        :playlist="sale.bundle.units[0]"
        :project="sale.bundle.project"
      />
    </div>
    <div v-if="format === 'assets'" class="lp-main">
      <LibraryTable class="toggle-item" :items="assets" />
    </div>
    <div class="lp-menu absolute bottom-0 left-0 w-screen p-3 bg-white z-50 flex justify-center">
      <div class="flex flex-wrap justify-around items-center w-full max-w-screen-md">
        <div class="flex items-center mb-2 sm:mb-0">
          <span class="h6 mr-2">FORMAT:</span>
          <Button
            v-for="(item, i) in formats"
            :key="`format-btn-${i}`"
            :bg-color="item === format ? 'black' : 'dark-200'"
            :class="{ 'mr-2': item === 'assets' }"
            :color="item === format ? 'white' : 'black'"
            :text="item.toUpperCase()"
            @click="onToggleFormat(item)"
          />
        </div>
        <div class="flex items-center">
          <span class="h6 mr-2">ORDER:</span>
          <Button
            v-for="(v, k) in orderIcons"
            :key="`order-btn-${v}`"
            :bg-color="k === sortOrder ? 'black' : 'dark-200'"
            :class="{ 'mr-2': k === 'asc' }"
            :color="k === sortOrder ? 'white' : 'black'"
            :icon="`chevron-${v}`"
            @click="onToggleSortOrder(k)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import LibraryCard from '@/components/items/LibraryCard.vue';
import LibraryTable from '@/components/items/LibraryTable.vue';
import { mapState } from 'vuex';

export default {
  name: 'Library',
  components: { Button, LibraryCard, LibraryTable },
  data() {
    return {
      format: 'bundles',
      sortOrder: 'asc',
      formats: ['assets', 'bundles'],
      orderIcons: {
        asc: 'up',
        desc: 'down'
      },
    }
  },
  computed: {
    ...mapState(['user']),
    assets() {
      function mapTrackToProject(track, project) {
        return { ...track, project };
      }
      const items = this.$_.flatMapDeep(
        this.bundles.map(b =>
          b.bundle.units[0].children.map(c =>
            mapTrackToProject(c, b.bundle.project)
          )
        )
      );
      return this.$_.orderBy(items, 'releaseDate', this.sortOrder)
    },
    bundles() {
      return this.$_.chain(this.user.library)
        .uniqBy('bundle.id')
        .orderBy('createdAt', this.sortOrder)
        .value();
    }
  },
  mounted() {
    this.$store.dispatch('user/loadLibrary');
  },
  methods: {
    onToggleFormat(selection) {
      this.format = selection;
    },
    onToggleSortOrder(selection) {
      this.sortOrder = selection;
    },
  }
};
</script>

<style lang="scss" scoped>
.lp-main {
  padding-bottom: 64px;
}

::-webkit-scrollbar {
  width: 17px;
  background-color: transparent;
  display: none;
}
</style>
