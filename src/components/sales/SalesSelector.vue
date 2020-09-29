<template>
  <div class="mx-auto my-0 w-screen max-w-screen-lg">
    <div class="header-image w-full">
      <img draggable="false" :src="headerImage" />
    </div>
    <div class="selector-body flex flex-col items-center">
      <div class="h3 mb-xxl sm:mb-xxxl text-center">
        You're supporting
        <b>{{ project.name }}</b>
        , a project by {{ project.ensemble.name }} & {{ project.series.name }}.
      </div>
      <SupportModule
        button-text
        class="max-w-screen-sm mb-xxl sm:mb-xxxl"
        :revenue="project.revenue"
        :budget="project.investment"
        :project-id="project.id"
        :ensemble="project.ensemble"
        :series="project.series"
      />
      <div class="text-center h5 mb-lg">BUNDLES FROM THIS PROJECT ({{ project.bundles.length }})</div>
      <div class="selector-carousel mb-xxl sm:mb-xxxl">
        <BundleCard
          v-for="(bundle, i) in project.bundles"
          :key="`selector-carousel-item-${i}`"
          :bg-color="bundle.image_colors ? bundle.image_colors.DarkMuted : null"
          :bundle-id="bundle.id"
          class="sc-item"
          :ensemble="project.ensemble"
          :image-url="bundle.image_url"
          large
          :name="bundle.name"
          :num-credits="project.ensemble.members.length"
          :num-tracks="bundle.units[0].children.length"
          :price="`$${Math.round(bundle.price / 100)}`"
          :project-id="project.id"
          :series="project.series"
          style="margin: 0 auto;"
          @click="activateBundleViewer"
          @more-info-click="activateBundleViewer"
        />
      </div>
      <UniversalCart :bundles="user.cart" class="mb-4 mx-auto max-w-screen-sm" />
      <Button
        class="mb-8"
        text="PROCEED TO CHECKOUT"
        bg-color="green-light"
        @click="$emit('activate-sales-mode', { newMode: 'checkout' })"
      />
      <div
        class="text-center h5 mb-lg"
      >BUNDLES FROM OTHER PROJECTS ({{ project.otherBundles.length }})</div>
      <div class="selector-carousel mb-xxl sm:mb-xxxl mx-auto">
        <BundleCard
          v-for="(bundle, i) in project.otherBundles"
          :key="`other-bundles-${i}`"
          :bg-color="bundle.image_colors ? bundle.image_colors.DarkMuted : null"
          :bundle-id="bundle.id"
          class="sc-item"
          :ensemble="bundle.project.ensemble"
          :image-url="bundle.image_url"
          large
          :name="bundle.name"
          :num-credits="bundle.project.ensemble.members.length"
          :num-tracks="bundle.units[0].children.length"
          :price="`$${Math.round(bundle.price / 100)}`"
          :project-id="bundle.project.id"
          :series="bundle.project.series"
          @click="activateBundleViewer"
          @more-info-click="activateBundleViewer"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BundleCard from '@/components/items/BundleCard.vue';
import Button from '@/components/buttons/Button.vue';
import SupportModule from '@/components/metrics/SupportModule.vue';
import UniversalCart from '@/components/sales/UniversalCart.vue';

import { mapState } from 'vuex';

export default {
  name: 'SalesSelector',
  components: {
    BundleCard,
    Button,
    SupportModule,
    UniversalCart
  },
  computed: {
    ...mapState(['project', 'user', 'windowWidth']),
    headerImage() {
      const defaultImage = 'https://i.picsum.photos/id/1002/1078/717.jpg';
      return this.project.image_url || defaultImage;
    },
    headerTextClass() {
      if (this.windowWidth < 768) {
        return 'h3';
      } else if (this.windowWidth < 1024) {
        return 'h2';
      } else {
        return 'hero-2';
      }
    },
    carouselItemWidth() {
      const { windowWidth: vw } = this;
      return vw < 768 ? 115 : 260;
    }
  },
  methods: {
    activateBundleViewer() {
      console.log('activating bundle viewer');
      this.$emit('activate-sales-mode', {
        newMode: 'viewer'
      });
    }
  }
};
</script>

<style lang="scss">
.selector-carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  @include for-size(medium-screen-up) {
    flex-direction: row;
    align-items: start;
    overflow-x: scroll;
  }
}

.sc-item {
  max-width: 100%;
  margin-bottom: 10px;
  @include for-size(medium-screen-up) {
    width: 320px;
    margin-right: 15px;
    flex-shrink: 0;
    margin-bottom: 0px;
  }
}
</style>

<style lang="scss" scoped>
.sales-selector {
  margin: 0 auto;
}

.selector-body {
  position: relative;
  padding: 340px 14px 0px;
  z-index: 10;
  @include for-size(medium-screen-up) {
    padding-top: 365px;
  }
  @include for-size(small-desktop-up) {
    padding-top: 410px;
  }
}

.header-image {
  position: absolute;
  left: 0;
  margin: 0 auto;
  overflow: hidden;
  height: 275px;
  @include for-size(medium-screen-up) {
    height: 300px;
  }
  @include for-size(small-desktop-up) {
    height: 345px;
  }
}

.gradient {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 200px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
  z-index: 2;
  @include for-size(medium-screen-up) {
    height: 225px;
  }
  @include for-size(small-desktop-up) {
    height: 250px;
  }
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 1px);
  object-fit: cover;
  object-position: center center;
}
</style>