<template>
  <div class="sales-checkout" data-test="sales-checkout-component">
    <UniversalCart v-if="!loading" :bundles="user.cart" class="full-width mb-10" />
    <SalesTerms class="full-width" />
    <SalesPaymentInfo />
  </div>
</template>

<script>
import UniversalCart from '@/components/sales/UniversalCart.vue';
import SalesPaymentInfo from '@/components/sales/SalesPaymentInfo.vue';
import SalesTerms from '@/components/sales/SalesTerms.vue';

import { mapState } from 'vuex';

export default {
  name: 'SalesCheckout',
  components: {
    UniversalCart,
    SalesPaymentInfo,
    SalesTerms
  },
  computed: {
    ...mapState(['user', 'loading'])
  }
};
</script>

<style lang="scss" scoped>
.sales-checkout {
  position: relative;
  padding: 20px 12px;
  margin: 0 auto;
  @include for-size(medium-screen-up) {
    padding-top: 100px;
  }
}

.sales-checkout,
.full-width {
  width: 100%;
  max-width: 600px;
}

::-webkit-scrollbar {
  width: 17px;
  background-color: transparent;
  display: none;
}
</style>