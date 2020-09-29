<template>
  <div class="sales-toolbelt">
    <div v-if="mode === 'selector'" class="flex justify-end items-center">
      <div
        v-if="cart.length"
        class="caption text-green-600 proceed-btn-text cursor-pointer"
        @click="activateMode('checkout')"
      >PROCEED TO CHECKOUT</div>
      <div v-else class="caption text-dark-500 proceed-btn-text">SELECT A BUNDLE</div>
    </div>
    <div v-if="mode === 'viewer'" class="flex justify-between items-center">
      <div class="button text-black cursor-pointer" @click="activateMode('selector')">Back</div>
      <Button trailing-icon="cart" bg-color="green-light" text="ADD TO CART" @click="addToCart" />
      <!-- <div /> -->
    </div>

    <div v-if="mode === 'checkout'" class="card-panel">
      <div class="card button text-black cursor-pointer" @click="activateMode('selector')">Back</div>
      <div
        v-if="!cart.length"
        class="card card--right caption text-dark-500 bg-fog-100"
      >YOUR CART IS EMPTY</div>
      <div
        v-if="agreedToTerms && paymentInfoIsValid"
        class="card card--right caption text-green-600 cursor-pointer"
        @click="emitValidateStripeEvent"
      >CHECKOUT FOR {{ cartTotal }}</div>
      <div
        v-else
        class="card card--right caption text-dark-500 bg-fog-100"
      >AGREE TO TERMS & INPUT PAYMENT TO CHECKOUT</div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';

export default {
  name: 'SalesToolbelt',
  components: {
    Button
  },
  props: {
    mode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currencyFormat: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      agreedToTerms: false,
      paymentInfoIsValid: false
    };
  },
  computed: {
    cart() {
      return this.$store.state.user.cart;
    },
    cartTotal() {
      if (!this.cart.length) return '$0';
      const bundles = this.cart;
      let totalPrice;

      if (bundles.length > 1) {
        totalPrice = bundles.reduce((a, b) => a + b.price / 100, 0);
      } else {
        totalPrice = bundles[0].price / 100;
      }
      return totalPrice.toLocaleString('en-US', this.currencyFormat);
    },
    fallbackProjectId() {
      const bundles = this.cart;
      if (bundles.length) {
        return bundles[0].projectId;
      }
      return 128;
    }
  },
  created() {
    this.$eventBus.$on('agreed-to-terms', this.updateAgreedToTerms);
    this.$eventBus.$on('validate-payment-info', this.validatePaymentInfo);
  },
  beforeDestroy() {
    this.$eventBus.$off('agreed-to-terms');
    this.$eventBus.$off('validate-payment-info');
  },
  methods: {
    activateMode(newMode) {
      if (this.$route.name.includes('cart-page')) {
        this.$router.push({ name: 'index-page' });
        return;
      }
      this.$emit('activate-sales-mode', { newMode });
    },
    addToCart() {
      this.$emit('add-to-cart');
    },
    updateAgreedToTerms(bool) {
      this.agreedToTerms = bool;
    },
    validatePaymentInfo(boolean) {
      this.paymentInfoIsValid = boolean;
    },
    emitValidateStripeEvent() {
      console.log('attempting to validate stripe...');
      this.$eventBus.$emit('validate-stripe');
    }
  }
};
</script>

<style lang="scss" scoped>
.sales-toolbelt {
  position: fixed;
  bottom: 0px;
  right: 0px;
  left: 0px;
  height: 60px;
  padding: 14px 18px;
  border-top: 1px solid rgba(0, 0, 0, 0.55);
  > div {
    height: 100%;
  }
}

.proceed-btn-text {
  width: 80px;
  text-align: right;
  cursor: cursor-pointer;
}

svg {
  width: 20px;
  height: 20px;
}

.card-panel {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 60px;
  background-color: #f3f3f3;
}

.card {
  width: 50%;
  max-width: 50%;
  flex: 0 0 auto;
  display: flex;
  padding: 14px 18px;
  align-items: center;
  height: 100%;
  &--right {
    justify-content: flex-end;
    text-align: right;
  }
}
</style>