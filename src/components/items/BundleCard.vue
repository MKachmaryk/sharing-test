<template>
  <div
    class="bundle-preview flex flex-col cursor-pointer"
    :style="containerStyleObject"
    @click="goToSalesFlow"
    @mouseover="hover=true"
    @mouseleave="hover=false"
  >
    <div class="flex justify-between items-center mb-sm">
      <div class="flex items-center" style="width: 90%;">
        <Card
          class="mr-xs cursor-pointer"
          format="person"
          :header="ensemble.name"
          :image="ensemble.image_url"
          style="max-width: 50%;"
          text-right
        />
        <span>&</span>
        <Card
          class="ml-xs cursor-pointer"
          format="person"
          :header="series.name"
          :image="series.image_url"
          style="max-width: 50%;"
          text-right
        />
      </div>
      <div class="h6 text-green-500">{{ priceFormatted }}</div>
    </div>
    <div :class="large ? 'flex flex-col' : 'flex'">
      <div :class="['mb-xs', 'image-wrap', { 'image-wrap--large': large }]">
        <img draggable="false" :src="imageUrl || image_url" />
      </div>
      <div class="flex flex-col justify-between" :class="{ 'text-section': !large }">
        <div class="text-white h6 truncate">{{ name }}</div>
        <div class="flex-col">
          <div
            class="footnote text-fog-700 mb-xs"
          >{{ numTracks }} TRACK{{ numTracks > 1 ? 'S': '' }}</div>
          <div
            class="footnote text-fog-500"
          >{{ ensemble.name }} & {{ numCredits }} collaborator{{ numCredits > 1 ? 's': '' }}</div>
        </div>
      </div>
    </div>
    <div class="gradient" @click.self="$emit('click')" />
    <div v-if="!hover" class="cta-box">
      <Button
        v-if="showAddToCartBtn && !inBundleViewer"
        bg-color="green-200"
        icon="cart-plus"
        color="fog-500"
      />
      <Button
        v-if="!showAddToCartBtn && !inSalesFlow && !inSettings"
        bg-color="green-200"
        icon="cart"
        @click="handleCheckoutBtnClick"
      />
    </div>
    <div v-else class="cta-box mb-xs">
      <div v-if="error" class="caption negative">Error!</div>
      <Button
        v-if="showAddToCartBtn && !inBundleViewer"
        text="More info"
        bg-color="fog-700"
        @click="handleMoreInfoBtnClick"
      />
      <Button
        v-if="showAddToCartBtn && !inBundleViewer"
        bg-color="green-200"
        class="ml-3"
        icon="cart-plus"
        @click="handleAddToCart"
      />
      <Button
        v-if="!showAddToCartBtn && !inBundleViewer"
        bg-color="red-200"
        class="ml-3"
        icon="cart-remove"
        @click="handleRemoveFromCart"
      />
      <Button
        v-if="!inSalesFlow"
        class="ml-3"
        text="Check out"
        bg-color="green"
        @click="handleCheckoutBtnClick"
      />
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import Card from '@/components/items/Card.vue';
import hexRgb from '@/helpers/hex-rgb.js';
import { mapState } from 'vuex';

export default {
  name: 'BundleCard',
  mixins: [hexRgb],
  components: {
    Button,
    Card
  },
  props: {
    bgColor: {
      type: String,
      default: '#444444'
    },
    bundleId: {
      type: [String, Number],
      required: true
    },
    ensemble: {
      type: Object,
      required: true
    },
    image_url: {
      type: String
    },
    imageUrl: {
      type: String
    },
    large: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: '375px'
    },
    name: {
      type: String,
      required: true
    },
    numCredits: {
      type: Number,
      default: 3
    },
    numTracks: {
      type: Number,
      required: true
    },
    price: {
      type: [String, Number],
      required: true
    },
    projectId: {
      type: Number,
      required: true
    },
    series: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      error: null,
      hover: false
    };
  },
  computed: {
    containerStyleObject() {
      const bgColor = this.bgColor || '#a0aec0';
      const color1 = this.hexToRgb(bgColor, 0.5);
      const color2 = this.hexToRgb(bgColor, 1);
      return {
        background: `linear-gradient(${color2} 0%, ${color1} 100%)`,
        maxWidth: this.maxWidth
      };
    },
    nameSize() {
      return this.name.length > 20 ? 'h6' : 'h5';
    },
    inBundleViewer() {
      return this.$route.name.includes('bundles-page');
    },
    inSalesFlow() {
      return (
        this.$route.name.includes('sales-page') ||
        this.$route.name.includes('bundles-page') ||
        this.$route.name.includes('cart-page')
      );
    },
    inSettings() {
      return this.$route.name.includes('settings');
    },
    priceFormatted() {
      return typeof this.price == 'number'
        ? `$${parseInt(this.price / 100)}`
        : this.price;
    },
    showAddToCartBtn() {
      if (!this.$store.state.user) return null;
      return !this.$store.state.user.cart.find(b => b.id === this.bundleId);
    }
  },
  methods: {
    goToSalesFlow() {
      const salesPages = [
        'sales-page',
        'bundles-page',
        'cart-page',
        'success-page'
      ];
      if (!salesPages.includes(this.$route.name)) {
        this.$router.push({
          name: 'sales-page',
          params: { projectId: this.projectId }
        });
      }
    },
    handleCheckoutBtnClick() {
      const { projectId } = this;
      this.$store.commit('setUnit', { unit: null });
      this.$store.commit('setProfile', { profile: null });
      this.$router.push({
        name: 'sales-page',
        params: { projectId }
      });
    },
    async handleAddToCart() {
      const body = {
        user_id: this.$store.state.user.id,
        bundle_id: this.bundleId
      };
      try {
        const { data } = await this.$pg.post(`/cart_item`, body);
        console.log({ cartItem: data });
        this.$store.dispatch('user/loadCart').then(() => {
          this.$emit('force-update');
        });
      } catch (error) {
        console.log({ error: error.response.data });
        this.flashError(error);
        this.$NProgress.done();
      }
    },
    async handleRemoveFromCart() {
      try {
        const url = `/cart_item?and=(user_id.eq.${this.$store.state.user.id},bundle_id.eq.${this.bundleId})`;
        const { data } = await this.$pg.delete(url);
        console.log({ cartItem: data });
        this.$store.dispatch('user/loadCart').then(() => {
          this.$emit('force-update');
        });
      } catch (error) {
        console.log({ error: error.response.data });
        this.flashError(error);
        this.$NProgress.done();
      }
    },
    handleMoreInfoBtnClick() {
      console.log('go to more info click...');
      if (this.inSalesFlow) {
        this.$emit('more-info-click', {
          newMode: 'viewer'
        });
      }
    },
    flashError(error) {
      this.error = error;
      setTimeout(() => (this.error = null), 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
.bundle-preview {
  position: relative;
  width: 100%;
  min-height: 208px;
  padding: 10px;
}

.image-wrap {
  flex-shrink: 0;
  position: relative;
  width: 150px;
  height: 150px;
  // padding-top: 100%;
  overflow: hidden;
  margin-right: 10px;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
}

.image-wrap--large {
  left: -10px;
  width: calc(100% + 20px);
  padding-top: 100%;
}

.up-entities {
  flex: 0 0 auto;
  width: calc(100% - 64px);
  max-width: calc(100% - 36px);
  flex-wrap: wrap;
  align-items: center;
  min-height: 28px;
}

.text-section {
  max-width: calc(100% - 160px);
}

.gradient {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 10;
  background: transparent;
}

.bundle-preview:hover .gradient {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

.cta-box {
  background: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  position: absolute;
  right: 8px;
  bottom: 8px;
  max-width: 40%;
  height: 40px;
  background-color: transparent;
  z-index: 100;
}
</style>