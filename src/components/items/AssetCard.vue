<template>
  <div class="asset-card w-full max-w-md" :style="containerBackground">
    <ImageContainer
      class="w-full max-h-3/4 mb-2 h-auto sm:h-0 pt-2/3 sm:pt-2/3 cursor-pointer"
      :src="project.image_url"
      @click="$router.push({ name: 'asset', params: { id: assetId } })"
    />
    <div class="px-2 mb-1">
      <Card
        class="mr-sm cursor-pointer"
        format="person"
        :header="project.ensemble.name"
        :image="project.ensemble.image_url"
        text-right
        @click="
          $router.push({
            name: 'profile',
            params: { entityType: 'ensemble', entityId: project.ensemble.entity_id }
          })
        "
      />
    </div>
    <div class="flex items-center px-2 mb-1">
      <!-- <span>&</span> -->
      <Card
        class="cursor-pointer"
        format="person"
        :header="project.series.name"
        :image="project.series.image_url"
        text-right
        @click="
          $router.push({
            name: 'profile',
            params: { entityType: 'series', entityId: project.series.entity_id }
          })
        "
      />
    </div>
    <div class="px-2 mb-2 cursor-pointer">
      <TrackListItem
        v-if="type === 'audio'"
        :name="name"
        :ensemble-name="project.ensemble.name"
        :duration-string="duration"
        :release-date="releaseDate"
        @click="$router.push({ name: 'asset', params: { id: assetId } })"
      />
      <Card
        v-else
        class="in-asset-card cursor-pointer"
        :header="name"
        :subheader="`${project.name}`"
        format="media"
        :image="image"
        text-right
        @click="$router.push({ name: 'asset', params: { id: assetId } })"
      />
    </div>
    <div class="px-2 mb-2 flex justify-between">
      <Button
        bg-color="fog-300"
        class="shadow"
        small
        text="ask a ?"
        text-size="xs"
        @click="
          $router.push({
            name: 'asset',
            params: { id: assetId },
            query: { from: 'ask' }
          })
        "
      />
      <Button
        v-if="project.bundles.length"
        bg-color="fog-300"
        class="shadow"
        :icon="bundleBtnIcon"
        small
        @click="onClickBundleBtn"
      />
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import Card from '@/components/items/Card.vue';
import ImageContainer from '@/components/items/ImageContainer.vue';
import TrackListItem from '@/components/items/TrackListItem.vue';

import { mapState } from 'vuex';

export default {
  name: 'AssetCard',
  components: { Button, Card, ImageContainer, TrackListItem },
  props: {
    assetId: [Number, String],
    image: String,
    project: Object,
    name: String,
    type: String,
    releaseDate: String,
    metadata: [Array, Object]
  },
  computed: {
    ...mapState(['user']),
    bundleBtnIcon() {
      if (!this.project.bundles.length) return '';
      const purchased = this.project.bundles.find(o =>
        this.user.purchased.map(p => p.bundle.id).includes(o.id)
      );
      const inCart = this.user.cart.find(
        o => o.id === this.project.bundles[0].id
      );
      if (purchased) return 'folder-download';
      if (inCart) return 'cart';
      return 'cart-plus';
    },
    containerBackground() {
      let backgroundColor;
      if (this.type === 'video') {
        backgroundColor = '#A0E0CB';
      } else if (this.type === 'audio') {
        backgroundColor = '#A3D4C3';
      } else if (this.type === 'playlist') {
        backgroundColor = '#EC9797';
      } else {
        backgroundColor = '#fff';
      }

      return { backgroundColor };
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

      if (this.type === 'playlist') {
        const duration = this.metadata.reduce(
          (a, b) => a + b.audio.duration,
          0
        );
        return formatDuration(duration);
      }
      if (this.metadata[this.type]) {
        return formatDuration(this.metadata[this.type].duration);
      }
      return '';
    },
    formattedReleaseDate() {
      if (!this.releaseDate) return '';
      return this.$moment(this.releaseDate).format('MMMM D YYYY');
    }
  },
  methods: {
    onClickBundleBtn() {
      const projectId = this.project.id;
      const options = {
        'folder-download': 'library',
        cart: { name: 'cart-page' },
        'cart-plus': { name: 'sales-page', params: { projectId } }
      };
      this.$router.push(options[this.bundleBtnIcon]);
    }
  }
};
</script>
