<template>
  <div id="home-view" class="w-screen h-full overflow-y-scroll">
    <div class="w-full max-w-screen-xl mx-auto px-4 sm:px-8 pt-5 pb-24">
      <div v-if="copy" id="home-header-menu" class="grid grid-cols-2 sm:grid-cols-3 mb-5">
        <div v-if="windowWidth > 640"></div>
        <AppLogo class="items-center sm:mx-auto" />
        <div class="flex flex-col items-end">
          <Button
            v-for="item in menu"
            :key="`menu-btn-${item.name}`"
            bg-color="fog-700"
            class="mb-xs"
            color="black"
            :icon="item.icon"
            :text="item.name"
            @click="$router.push(item.path)"
          />
          <Button
            key="log-out-btn"
            bg-color="fog-700"
            class="mb-xs"
            color="black"
            icon="logout"
            text="LOG OUT"
            @click="$store.dispatch('logout')"
          />
        </div>
      </div>
      <div v-if="$store.state.copy" id="home-promo-cards" class="grid mb-3 gap-3" :class="promoGridSettings">
        <PromoCard
          v-for="type in activeTypes"
          :key="`pc-${type}`"
          :type="type"
          @filter-promo-cards="onFilterPromoCards"
        />
      </div>
      <ProjectModule
        v-for="project in spotlights.filter(p => p.units.length && p.bundles.length).slice(0, 1)"
        :key="`spotlight-${project.id}`"
        class="mb-4 mx-auto"
        :project="project"
      />
      <carousel
        class="w-full mb-md"
        :perPageCustom="[[250, 1], [640, 2], [900, 3]]"
        paginationColor="lightgrey"
      >
        <template v-for="item in activeIndexList.slice(0, Math.ceil(activeIndexList.length / 2))" >
          <slide :key="item.id">
            <PreviewCard
              class="related-cards"
              :ensemble="item.project.ensemble"
              :project-image-url="item.project.image_url"
              :project-name="item.project.name"
              :series="item.project.series"
              :unit="item"
            />
          </slide>
        </template>
      </carousel>
      <ProjectModule
        v-for="project in spotlights.filter(p => p.units.length && p.bundles.length).slice(1)"
        :key="`spotlight-${project.id}`"
        class="mb-4 mx-auto"
        :project="project"
      />
      <carousel
        class="w-full mb-md"
        :perPageCustom="[[250, 1], [640, 2], [900, 3]]"
        paginationColor="lightgrey"
      >
        <template v-for="item in activeIndexList.slice(-Math.ceil(activeIndexList.length / 2))" >
          <slide :key="item.id">
            <PreviewCard
              class="related-cards"
              :ensemble="item.project.ensemble"
              :project-image-url="item.project.image_url"
              :project-name="item.project.name"
              :series="item.project.series"
              :unit="item"
            />
          </slide>
        </template>
      </carousel>
      <!-- <transition-group
        class="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
        mode="out-in"
        name="list"
        tag="main"
      >
        <AssetCard
          v-for="item in activeIndexList"
          :key="`item-${item.id}`"
          class="mx-auto"
          :asset-id="item.id"
          :image="item.image_url"
          :project="item.project"
          :name="item.name"
          :release-date="item.releaseDate"
          :type="item.type"
          :metadata="item.type === 'playlist' ? item.children : item.file"
        />
      </transition-group> -->
    </div>
    <IndexFilterMenu
      :active-media="activeMedia"
      :sort-order="sortOrder"
      @toggle-sort-order="onToggleSortOrder"
      @update-media-filter="onUpdateMediaFilter"
    />
  </div>
</template>

<script>
import AppLogo from '@/components/logos/AppLogo.vue';
import Button from '@/components/buttons/Button.vue';
import AssetCard from '@/components/items/AssetCard.vue';
import PreviewCard from '@/components/items/PreviewCard.vue';
import PromoCard from '@/components/items/PromoCard.vue';
import IndexFilterMenu from '@/components/modules/IndexFilterMenu.vue';
import ProjectModule from '@/components/modules/ProjectModule.vue';
import { mapState } from 'vuex';
import { Carousel, Slide } from 'vue-carousel';

export default {
  name: 'Home',
  components: {
    AppLogo,
    Button,
    AssetCard,
    PreviewCard,
    IndexFilterMenu,
    ProjectModule,
    PromoCard,
    Carousel,
    Slide
  },
  data() {
    return {
      activeMedia: ['playlist', 'video'],
      activeTypes: [],
      editing: false,
      sortOrder: 'asc',
      menu: [
        { name: 'settings', icon: 'cog-outline', path: 'settings' },
        { name: 'library', icon: 'package', path: 'library' }
      ]
    };
  },
  computed: {
    ...mapState(['indexList', 'spotlights', 'user', 'windowWidth', 'copy']),
    activeIndexList() {
      const filtered = this.indexList.filter(o =>
        this.activeMedia.includes(o.type)
      );
      const sorted = this.$_.orderBy(filtered, 'releaseDate', this.sortOrder);
      return sorted;
    },
    promoGridSettings() {
      return this.activeTypes.length === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1';
    }
  },
  watch: {
    '$route.query.from': 'verifyUser'
  },
  mounted() {
    this.onFilterPromoCards();
    this.fetchData();
  },
  methods: {
    async fetchData() {
      if (!this.indexList.length) {
        await this.$store.dispatch('loadIndex');
      }
      if (!this.user.id) {
        const [_, _a] = await Promise.all([
          this.$store.dispatch('user/loadPurchased'),
          this.$store.dispatch('user/loadCart')
        ]);
      }
    },
    onToggleSortOrder(selection) {
      this.sortOrder = selection;
    },
    onUpdateMediaFilter(activeMedia) {
      this.activeMedia = activeMedia;
    },
    onFilterPromoCards() {
      this.activeTypes = ['motive', 'alpha'].filter(
        v => localStorage.getItem(v) !== 'hide'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.list-enter-active {
  transition: opacity 200ms 200ms;
}

.list-leave-active {
  transition: opacity 200ms;
}

.list-enter,
.list-leave-to {
  opacity: 0;
}

.list-move {
  transition: transform 300ms;
}

.home-logo {
  position: absolute;
  left: calc(50% - 38px / 2);
}

.related-cards {
  min-width: 250px;
  width: calc(100vw - 40px) !important;
  margin: 0 auto;
  @include min-width(640) {
    width: calc(100% - 12px) !important;
    max-width: 320px !important;
    margin: 0 auto;
  }
  @include min-width(900) {
    width: calc(100% - 12px) !important;
    max-width: 280px !important;
    margin: 0 auto;
  }
}
</style>
