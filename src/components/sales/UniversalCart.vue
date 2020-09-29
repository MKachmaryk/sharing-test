<template>
  <div class="flex flex-col justify-start">
    <div class="text-center h5 mb-lg">
      <CartIcon :size="18" />
      YOUR CART ({{ bundles.length}})
    </div>
    <div v-if="bundles.length" class="flex flex-col items-center">
      <BundleListItem
        v-for="(bundle, i) in displayBundles"
        :key="`cart-preview-${i}`"
        :bg-color="bundle.image_colors ? bundle.image_colors.Vibrant : '#000000'"
        :bundle-id="bundle.id"
        class="mb-sm"
        :ensemble="bundle.project.ensemble"
        :image-url="bundle.image_url"
        :name="bundle.name"
        :num-credits="bundle.project.ensemble.members.length"
        :num-tracks="bundle.units[0].children.length"
        :price="bundle.priceFormatted || bundle.price"
        :project-id="bundle.project.id"
        :series="bundle.project.series"
        @force-update="$forceUpdate"
      />
      <div class="flex flex-co self-end">
        <Button
          v-if="!inSalesFlow"
          bg-color="green-light"
          class="mb-sm"
          data-test="universal-cart-btn"
          :text="`Check out ${subtotal}`"
          @click="handleCheckoutBtnClick"
        />
        <div v-else class="flex items-center h5">
          <div class="mr-sm">TOTAL</div>
          <div class="text-green-600">{{ subtotal }}</div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="footnote text-dark-500"
      style="max-width: 350px;"
    >Your cart is currently empty. That’s okay, but you should add a bundle to see our sweet sales experience.</div>
  </div>
</template>

<script>
import BundleListItem from '@/components/items/BundleListItem.vue';
import CartIcon from 'vue-material-design-icons/Cart.vue';
import TextButton from '@/components/buttons/TextButton.vue';

export default {
  name: 'UniversalCart',
  components: {
    BundleListItem,
    CartIcon,
    TextButton
  },
  props: {
    bundles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currencyFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    };
  },
  computed: {
    displayBundles() {
      if (this.inSalesFlow) {
        return this.bundles;
      }
      return this.bundles.slice(0, 2);
    },
    inSalesFlow() {
      return (
        this.$route.name.includes('sales-page') ||
        this.$route.name.includes('cart-page')
      );
    },
    subtotal() {
      const subtotal = this.bundles.reduce((a, b) => a + b.price / 100, 0);
      return subtotal.toLocaleString('en-US', this.currencyFormat);
    }
  },
  methods: {
    handleCheckoutBtnClick() {
      this.goToCartPage();
    },
    goToCartPage() {
      this.$router.push({ name: 'cart-page' });
    }
  }
};
</script>

<style lang="scss" scoped>
svg {
  width: 24px;
  height: 24px;
  fill: rgba(255, 255, 255, 0.3);
  margin-right: 8px;
}
</style>