<template>
  <div v-if="user" class="sales-page h-full overflow-y-hidden">
    <div ref="module" :class="['sales-body', { 'success': mode === 'success'}]">
      <!-- MODULE -->
      <SalesSelector
        v-if="project && (mode === 'selector')"
        @activate-sales-mode="activateSalesMode"
      />
      <SalesViewer v-if="mode === 'viewer'" @add-to-cart="handleAddToCart" />
      <SalesCheckout v-if="mode === 'checkout'" />
      <template v-if="mode === 'success' && newPurchases">
        <SalesSuccess
          v-for="(purchase, i) in newPurchases"
          :key="`success-purchase-${i}`"
          :bundle="purchase.bundle"
        />
      </template>
    </div>
    <!-- TOOLBELT -->
    <SalesToolbelt
      v-if="mode !== 'success'"
      :mode="mode"
      @add-to-cart="handleAddToCart"
      @activate-sales-mode="activateSalesMode"
    />
    <div v-if="error" class="error button">{{ error }}</div>
  </div>
</template>

<script>
import SalesSelector from '@/components/sales/SalesSelector.vue';
import SalesSuccess from '@/components/sales/SalesSuccess.vue';
import SalesCheckout from '@/components/sales/SalesCheckout.vue';
import SalesToolbelt from '@/components/sales/SalesToolbelt.vue';
import SalesViewer from '@/components/sales/SalesViewer.vue';

import { mapState } from 'vuex';

export default {
  name: 'Sales',
  components: {
    SalesSelector,
    SalesSuccess,
    SalesCheckout,
    SalesToolbelt,
    SalesViewer
  },
  data() {
    return {
      mode: 'selector',
      error: '',
      stripePaymentInfo: {
        cardNumber: null,
        error: null,
        stripe: null,
        success: false,
        token: ''
      }
    };
  },
  computed: {
    ...mapState(['project', 'user']),
    bundle() {
      return this.project ? this.project.bundles[0] : null;
    },
    headerImage() {
      if (this.mode === 'checkout' || this.mode === 'success') {
        return null;
      }
      return this.mode === 'viewer'
        ? this.project.bundles[0].image_url
        : this.project.image_url;
    },
    newPurchases() {
      const { library } = this.user;
      const ONE_MIN = 1 * 60 * 1000;
      const now = new Date();
      return library.filter(p => now - new Date(p.createdAt) <= ONE_MIN);
    }
  },
  watch: {
    $route: 'fetchData'
  },
  created() {
    this.$eventBus.$on('remove-from-cart', this.handleRemoveFromCart);
    this.$eventBus.$on('purchase', this.completeStripePurchase);
  },
  mounted() {
    this.fetchData();
  },
  beforeDestroy() {
    this.$eventBus.$off('remove-from-cart');
    this.$eventBus.$off('purchase');
    this.$store.commit('setProject', { project: null });
  },
  methods: {
    fetchData() {
      const { name } = this.$route;
      if (name === 'sales-page') {
        this.fetchSelectorData();
      } else if (name === 'bundles-page') {
        this.goToBundleViewer();
      } else if (name === 'cart-page') {
        this.goToCheckout();
      } else if (name === 'success-page') {
        this.goToSuccessPage();
      }
    },
    async fetchSelectorData() {
      const { projectId } = this.$route.params;
      this.$store
        .dispatch('loadSalesPage', { projectId })
        .then(() => {
          this.mode = 'selector';
          this.$refs.module.scrollTop = 0;
          this.$store.dispatch('user/loadPurchased');
          this.$store.dispatch('user/loadCart');
        })
        .catch(error => {
          console.log(error);
        });
    },
    async goToBundleViewer() {
      const { projectId } = this.$route.params;
      this.$store
        .dispatch('loadSalesPage', { projectId })
        .then(() => {
          this.mode = 'viewer';
          this.$refs.module.scrollTop = 0;
        })
        .catch(error => {
          console.log(error);
        });
    },
    goToCheckout() {
      this.mode = 'checkout';
    },
    goToSuccessPage() {
      this.mode = 'success';
    },
    activateSalesMode({ newMode }) {
      console.log(`activating sales mode: ${newMode}`);
      const projectId = this.project ? this.project.id : null;
      const options = {
        selector: { name: 'sales-page', params: { projectId: projectId } },
        viewer: { name: 'bundles-page', params: { projectId: projectId } },
        checkout: { name: 'cart-page' },
        success: { name: 'success-page' }
      };
      const params = options[newMode];
      console.log({ options, params });
      this.$router.push(params);
    },
    async handleAddToCart() {
      const body = {
        user_id: this.user.id,
        bundle_id: this.bundle.id
      };
      try {
        const { data } = await this.$pg.post(`/cart_item`, body);
        console.log({ cartItem: data });
        this.$store.dispatch('user/loadCart').then(() => {
          this.activateSalesMode({ newMode: 'checkout' });
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
        const url = `/cart_item?and=(user_id.eq.${this.user.id},bundle_id.eq.${this.bundle.id})`;
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
    flashError(error) {
      this.error = error;
      setTimeout(() => (this.error = ''), 3000);
    },
    completeStripePurchase({ paymentInfo }) {
      console.log({ paymentInfo });
      this.stripePaymentInfo = paymentInfo;
      const cardIsSaved = Object.keys(paymentInfo).includes('last4');

      if (cardIsSaved) {
        this.purchaseWithSavedCard();
      } else {
        this.purchaseWithNewCard();
      }
    },
    async postSaleToServer() {
      const sales = this.user.cart.map(bundle => ({
        user_id: this.user.id,
        bundle_id: bundle.id,
        subtotal: bundle.price,
        sales_tax: 0,
        total: bundle.price
      }));
      try {
        const { data: newSales } = await this.$pg.post('/sale', sales);
        console.log({ newSales });
        this.$store
          .dispatch('user/loadLibrary')
          .then(() => {
            this.activateSalesMode({ newMode: 'success' });
            this.$refs.module.scrollTop = 0;
            this.$forceUpdate();
          })
          .then(async () => {
            const bundleIds = this.user.cart.map(b => b.id);
            const ps = await bundleIds.map(async bundleId => {
              const filter = `and=(user_id.eq.${this.user.id},bundle_id.eq.${bundleId})`;
              const url = `/cart_item?${filter}`;
              await this.$pg.delete(url);
            });
            await Promise.all(ps);
            const cart = [];
            this.$store.commit('user/setCart', cart);
          });
      } catch (error) {
        console.log(error);
        this.flashError(error);
      }
    },
    purchaseWithNewCard() {
      this.stripePaymentInfo.stripe
        .createToken(this.stripePaymentInfo.cardNumber)
        .then(result => {
          if (result.error) {
            this.stripePaymentInfo.error = result.error.message;
            this.flashError(this.stripePaymentInfo.error);
          } else {
            // this.stripePaymentInfo.token = result.token.id;
            // const url = `buy/${this.bundle.bundle_id}`;
            // console.log({ info: this.stripePaymentInfo, url })
            // this.$http
            //   .post(url, {
            //     stripeToken: this.stripePaymentInfo.token,
            //   })
            //   .then((response) => {
            //     // eslint-disable-next-line
            //     console.log(response);
            //     this.stripePaymentInfo.success = true;
            //     setTimeout(() => {
            //       this.incrementStep();
            //     }, 500);
            //   });
            this.postSaleToServer();
          }
        });
    },
    purchaseWithSavedCard() {
      // let url = "buy/" + this.bundle.bundle_id;
      // this.$http
      //   .post(url, {
      //     last4: this.paymentInfo.last4,
      //   })
      //   .then(response => {
      //     // eslint-disable-next-line
      //     console.log(response);
      //     this.paymentInfo.success = true;
      //     setTimeout(() => {
      //       this.incrementStep();
      //     }, 500);
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   })
      this.postSaleToServer();
    }
  }
};
</script>

<style lang="scss" scoped>
.sales-body {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  max-width: 1280px;
  margin: 0 auto;
  overflow-y: scroll;
}

.sales-body.success {
  height: 100%;
}

.header-image {
  position: absolute;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  overflow: hidden;
  height: 275px;
  @include for-size(medium-screen-up) {
    height: 392px;
  }
  @include for-size(small-desktop-up) {
    height: 432px;
  }
  .gradient {
    position: absolute;
    bottom: -2px;
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
  img {
    max-width: 600px;
    max-height: 600px;
  }
  @include min-width(600) {
    margin-top: 55px;
  }
  .gradient {
    display: none;
  }
}

.error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  padding: 8px;
  background-color: #fed7d7;
  color: #e53e3e;
  text-align: center;
  z-index: 10000;
  opacity: 1;
  transform: opacity 300ms ease;
}

.chevron {
}

::-webkit-scrollbar {
  width: 17px;
  background-color: transparent;
  display: none;
}
</style>