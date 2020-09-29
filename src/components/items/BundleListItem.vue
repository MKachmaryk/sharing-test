<template>
  <div class="bundle-list-item relative w-full flex flex-col" :style="containerStyleObject">
    <div class="flex">
      <div class="h-full">
        <ImageContainer class="w-14 mr-sm bli-img" square :src="imageUrl" />
      </div>
      <div class="flex flex-col justify-between details max-w-3/4">
        <div class="button text-black ensemble-name truncate">{{ name }}</div>
        <div class="flex-col">
          <div
            class="footnote text-black-secondary"
          >{{ numTracks }} TRACK{{ numTracks > 1 ? 'S': '' }}</div>
          <div
            class="footnote text-black-secondary"
          >{{ ensemble.name }} & {{ numCredits }} collaborator{{ numCredits > 1 ? 's': '' }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-end items-center price">
      <FolderDownloadIcon v-if="inLibrary" class="mr-xs" />
      <div class="button text-green-500">{{ priceFormatted }}</div>
    </div>
    <div v-if="!inSettings" class="overlay solid" />
    <div v-if="!inSettings" class="overlay gradient" @click.self="$emit('click')" />
    <div v-if="!inSettings" class="hover-prompts">
      <div v-if="error" class="caption negative">Error!</div>
      <Button
        v-if="showAddToCartBtn"
        class="mr-3"
        text="More info"
        bg-color="fog-700"
        @click="handleMoreInfoBtnClick"
      />
      <Button
        v-if="showAddToCartBtn"
        bg-color="green-200"
        icon="cart-plus"
        @click="handleAddToCart"
      />
      <Button
        v-if="!showAddToCartBtn"
        bg-color="red-200"
        icon="cart-remove"
        @click="handleRemoveFromCart"
      />
      <Button
        v-if="!showAddToCartBtn && !inSalesFlow"
        text="Check out"
        bg-color="green"
        @click="handleCheckoutBtnClick"
      />
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import ImageContainer from '@/components/items/ImageContainer.vue';
import FolderDownloadIcon from 'vue-material-design-icons/FolderDownload.vue';
import hexRgb from '@/helpers/hex-rgb.js';

import { mapState } from 'vuex';

export default {
  name: 'BundleListItem',
  mixins: [hexRgb],
  components: {
    Button,
    ImageContainer,
    FolderDownloadIcon
  },
  props: {
    bgColor: {
      type: String,
      default: 'lightsteelblue'
    },
    bundleId: {
      type: [String, Number],
      required: true
    },
    ensemble: {
      type: Object,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    numCredits: {
      type: Number,
      required: true
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
    },
    inCartPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      error: null
    };
  },
  computed: {
    ...mapState(['user']),
    containerStyleObject() {
      const bgColor = this.bgColor || '#a0aec0';
      const color1 = this.hexToRgb(bgColor, 0.3);
      const color2 = this.hexToRgb(bgColor, 0.7);
      return {
        background: `linear-gradient(${color2} 0%, ${color1} 100%)`
      };
    },
    inLibrary() {
      return (
        this.user.purchased.find(p => p.bundle.id === this.bundleId) || false
      );
    },
    inSalesFlow() {
      return (
        this.$route.name.includes('sales-page') ||
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
      return !this.user.cart.find(b => b.id === this.bundleId);
    }
  },
  methods: {
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
        user_id: this.user.id,
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
        const url = `/cart_item?and=(user_id.eq.${this.user.id},bundle_id.eq.${this.bundleId})`;
        const { data } = await this.$pg.delete(url);
        await this.$store.dispatch('user/loadCart');
        this.$emit('force-update');
      } catch (error) {
        console.log({ error: error.response.data });
        this.flashError(error);
        this.$NProgress.done();
      }
    },
    handleMoreInfoBtnClick() {
      console.log('go to more info click...');
      // TO-DO: PUSH TO CORRESPONDING ROUTE
    },
    flashError(error) {
      this.error = error;
      setTimeout(() => (this.error = null), 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
.bundle-list-item {
  min-height: 76px;
  padding: 10px;
  max-width: 400px;
}

.bli-img {
  max-width: 56px;
  height: 56px;
}

.details {
  max-width: calc(100% - 100px);
}

.ensemble-name {
  flex-wrap: no-wrap;
  overflow: hidden;
  max-width: calc(100% - 36px);
  height: 24px;
}

.price {
  position: absolute;
  top: 10px;
  right: 10px;
}

.bundle-list-item:hover .price {
  display: none;
}

.material-design-icon > .material-design-icon__svg {
  width: 16px;
  height: 16px;
  fill: #48bb78; // green-500
}

.overlay {
  background: transparent;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 10;
}

.overlay.solid {
  right: 0;
  width: 35%;
}

.overlay.gradient {
  left: 0;
  width: 65%;
}

.bundle-list-item:hover .overlay.solid {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0px 6px 6px 0px;
}

.bundle-list-item:hover .overlay.gradient {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  border-radius: 6px 0px 0px 6px;
}

.hover-prompts {
  display: none;
}

.bundle-list-item:hover .hover-prompts {
  background: transparent;
  display: flex;
  position: absolute;
  right: 10px;
  bottom: 10px;
  max-width: 70%;
  height: 40px;
  background-color: transparent;
  z-index: 100;
}
</style>