<template>
  <div class="flex flex-col items-center mx-auto my-0 w-screen max-w-screen-lg px-3 sm:px-0">
    <div class="my-xxl h3 text-center">{{ bundle.name }}</div>
    <div class="w-1/2 mb-xxxl">
      <ImageContainer :src="bundle.image_url" square />
    </div>

    <!-- Included in this bundle -->
    <div class="h5 mb-xl text-center">INCLUDED IN THIS BUNDLE</div>
    <list-group class="flex flex-wrap justify-center max-w-screen-lg mb-xxxl">
      <TrackListItem
        v-for="(track, i) in bundle.units[0].children"
        :key="`track-${track.entity_id}`"
        :class="['mb-sm', 'bg-fog', 'p-1', { 'mr-sm': i % 2 === 0 }]"
        :name="track.name"
        :duration-sec="track.audio.duration"
        :ensemble-name="project.ensemble.name"
        :release-date="track.releaseDate"
        :song-colors="track.audio.colors"
      />
    </list-group>

    <!-- How you make a difference -->
    <div class="h5 mb-xl text-center">HOW YOUR CONTRIBUTION MAKES A DIFFERENCE:</div>
    <div class="flex flex-center mb-xxxl">
      <div class="w-2/5 flex flex-col justify-center items-end p-2 z-0">
        <div class="body font-bold">{{ user.name }}</div>
        <div class="body italic">Supporter #{{ bundle.sales.length + 1 }}</div>
        <br />
        <div class="h2">+${{ bundle.price / 100 }}</div>
      </div>
      <Avatar :src="user.imageUrl" size="xxxl" @click="goToProfilePage('user', user.entity_id)" />
      <div class="w-2/5 flex flex-col justify-center p-2 z-0">
        <div class="body font-bold">ROLE UPGRADE</div>
        <div class="body italic">You'd become a supporting member.</div>
        <div class="h2 ml-24 text-fog">+15</div>
      </div>
    </div>

    <!-- Support module -->
    <div
      class="flex flex-center flex-wrap sm:flex-no-wrap mb-xxl sm:mb-xxxl w-full max-w-screen-md"
    >
      <ProfitShare
        :ensemble-name="project.ensemble.name"
        :ensemble-share="project.contract.artistShare"
        :series-name="project.series.name"
      />
      <SupportModule
        :button-text="`ADD TO CART & CHECK OUT FOR $${bundle.price/100}`"
        class="h-full"
        :revenue="project.revenue"
        :budget="project.investment"
        :project-id="project.id"
        :ensemble="project.ensemble"
        :series="project.series"
        style="max-width: 420px;"
        @support="$emit('add-to-cart')"
      />
    </div>

    <!-- Thank you -->
    <div class="h5 mb-lg text-center">THANK YOU TO OUR SUPPORTERS</div>
    <div class="flex justify-around w-full max-w-screen-sm">
      <Badge label="supporters" :quantity="supporters.length" />
      <Badge label="raised" :quantity="project.revenue" currency />
    </div>
    <list-group class="grid grid-cols-2 sm:grid-cols-4 max-w-screen-lg mb-xl">
      <Card
        v-for="user in supporters"
        :key="`supporter-${user.entity_id}`"
        :header="user.name"
        :image="user.image_url"
        format="person"
        style="flex: 0 1 auto; margin: 10px;"
        text-right
        @click="goToProfilePage('user', user.entity_id)"
      />
    </list-group>
  </div>
</template>

<script>
import Avatar from '@/components/items/Avatar.vue';
import Badge from '@/components/items/Badge.vue';
import Card from '@/components/items/Card.vue';
import ImageContainer from '@/components/items/ImageContainer.vue';
import ListGroup from '@/components/modules/ListGroup.vue';
import ProfitShare from '@/components/metrics/ProfitShare.vue';
import SupportModule from '@/components/metrics/SupportModule.vue';
import TrackListItem from '@/components/items/TrackListItem.vue';

import { mapState } from 'vuex';

export default {
  name: 'SalesViewer',
  components: {
    Avatar,
    Badge,
    Card,
    ImageContainer,
    ListGroup,
    ProfitShare,
    SupportModule,
    TrackListItem
  },
  computed: {
    ...mapState(['project', 'user', 'windowWidth']),
    bundle() {
      return this.project.bundles[0];
    },
    supporters() {
      return this.$_.uniqBy(
        this.bundle.sales.map(s => s.user),
        'id'
      );
    }
  },
  mounted() {
    setTimeout(() => this.$forceUpdate(), 100);
  }
};
</script>

<style lang="scss" scoped>
.sales-viewer {
  position: relative;
  width: 100%;
  max-width: 600px;
  padding: 0px 12px;
  margin: 0 auto;
  > div {
    min-width: 100%;
  }
  @include min-width(624) {
    padding: 32px 0px 0px;
  }
}

.header-image {
  position: absolute;
  width: 100%;
  max-width: 1124px;
  margin: 0 auto;
  overflow: hidden;
  height: 275px;
  @include for-size(medium-screen-up) {
    height: 392px;
  }
  @include for-size(small-desktop-up) {
    height: 432px;
  }
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.header-image--viewer-module {
  position: relative;
  max-width: 600px;
  max-height: 600px;
  padding-top: 100%;
  left: -12px;
  width: calc(100% + 24px);
  // margin-bottom: 24px;
  img {
    max-width: 600px;
    max-height: 600px;
  }
  @include min-width(600) {
    margin-top: 55px;
    left: 0px;
    width: 600px;
  }
  .gradient {
    display: none;
  }
}

.header-image--bundle-preview {
  margin: 0px auto;
  width: 375px;
  height: auto;
}

.bundle-title {
  font-size: 34px;
  line-height: 40px;
  font-weight: 600;
  @include for-size(medium-screen-up) {
    font-size: 45px;
    line-height: 48px;
  }
}

ol {
  list-style-type: decimal-leading-zero;
  list-style-position: inside;
  padding-left: 0;
}

hr {
  margin-top: -4px;
  width: 16px;
  border-top: dotted 2px white;
  transform: rotate(90deg);
}

.sv-financial-details {
  display: flex;
  flex-direction: column;
  padding: 0px 24px;
  @include for-size(medium-screen-up) {
    flex-direction: row;
    justify-content: space-between;
    padding: 0px;
    // .flex-col-sb {
    //   width: 49%;
    // }
  }
}

.contribution-comparison {
  margin-bottom: 10px;
  @include for-size(medium-screen-up) {
    margin-bottom: 0px;
  }
}

.small-screen-only {
  @include for-size(medium-screen-up) {
    display: none;
  }
}

.medium-screen-up {
  display: none;
  @include for-size(medium-screen-up) {
    display: flex;
  }
}
</style>