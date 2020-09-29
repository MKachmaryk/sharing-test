<template>
  <div class="sales-payment-info">
    <div class="inline-block relative w-64">
      <select
        v-model="selected"
        class="block appearance-none w-full bg-fog-700 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <option v-for="(option, i) in cardOptions" :key="`card-option-${i}`">{{ option }}</option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
      >
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
    <div class="pim__card flex-col">
      <div class="body text-dark-500 ml-sm mb-md pt-sm h-30">
        <div v-if="!savedCardIsSelected">New card</div>
      </div>
      <form v-show="!savedCardIsSelected" ref="stripeForm">
        <div class="input mb-xs">
          <div id="card-number" />
        </div>
        <div class="flex mb-xs">
          <div class="input mr-sm" style="width: 78px;">
            <div id="card-expiry" />
          </div>
          <div class="input" style="width: 60px;">
            <div id="card-cvc" />
          </div>
        </div>
      </form>
      <div
        v-if="savedCardIsSelected"
        class="body text-black input"
      >{{ passwordChars }}{{ cardOptions[1].split(" ")[1] }}</div>
      <div v-else-if="invalidInput" class="caption text-red mb-4">
        <span v-if="error.cardNumberError">{{ error.cardNumberError.toUpperCase() }}</span>
        <span v-if="error.cardExpiryError">{{ error.cardExpiryError.toUpperCase() }}</span>
        <span v-if="error.cardCvcError">{{ error.cardCvcError.toUpperCase() }}</span>
      </div>
      <div v-else class="pim-cta flex justify-end items-center">
        <div class="caption text-green-500 mr-sm">Save this card for next time</div>
        <Button
          bg-color="green-200"
          :icon="cardSaved ? 'check' : ''"
          color="green-500"
          @click.native="cardSaved = !cardSaved"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';

const stripeKey = 'pk_test_gq2OXLu20ERr8lrnCuUVNV8J';

export default {
  name: 'SalesPaymentInfo',
  components: {
    Button
  },
  data() {
    return {
      card: {
        number: '',
        expiry: '',
        cvc: ''
      },
      // elements
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      prButton: '',
      stripe: null,
      error: {
        stripeError: '',
        cardNumberError: '',
        cardExpiryError: '',
        cardCvcError: ''
      },
      cardOptions: ['New card', 'Visa 0240'],
      selected: 'New card',
      savedCardIsSelected: false,
      passwordChars: '\u2022\u2022\u2022\u2022 '.repeat(3),
      cardSaved: false
    };
  },
  computed: {
    invalidInput() {
      const {
        stripeError,
        cardNumberError,
        cardExpiryError,
        cardCvcError
      } = this.error;
      return stripeError || cardNumberError || cardExpiryError || cardCvcError;
    }
  },
  created() {
    this.$eventBus.$on('validate-stripe', this.validateToSendToken);
  },
  mounted() {
    this.setUpStripe();
  },
  beforeDestroy() {
    this.$eventBus.$off('validate-stripe');
  },
  watch: {
    card: {
      deep: true,
      handler() {
        const allTrue = Object.keys(this.card).every(key => this.card[key]);
        if (allTrue) {
          this.$eventBus.$emit('validate-payment-info', true);
        }
      },
      immediate: true
    },
    selected: 'toggleCardOption'
  },
  methods: {
    clearCardErrors() {
      this.error.stripeError = '';
      this.error.cardCvcError = '';
      this.error.cardExpiryError = '';
      this.error.cardNumberError = '';
    },
    listenForErrors() {
      const vm = this;
      this.cardNumber.addEventListener('change', event => {
        vm.toggleError(event);
        // vm.error.cardNumberError = "";
        vm.card.number = !!event.complete;
      });
      this.cardExpiry.addEventListener('change', event => {
        vm.toggleError(event);
        // vm.error.cardExpiryError = "";
        vm.card.expiry = !!event.complete;
      });
      this.cardCvc.addEventListener('change', event => {
        vm.toggleError(event);
        // vm.error.cardCvcError = "";
        vm.card.cvc = !!event.complete;
      });
    },
    toggleCardOption() {
      if (this.selected == 'New card') {
        this.savedCardIsSelected = false;
        this.$eventBus.$emit('validate-payment-info', false);
        // setTimeout(() => {
        //   this.setUpStripe();
        // }, 0);
      } else {
        this.savedCardIsSelected = true;
        this.$eventBus.$emit('validate-payment-info', true);
      }
    },
    setUpStripe() {
      if (window.Stripe === undefined) {
        alert('Stripe V3 library not loaded!');
      } else {
        const stripe = window.Stripe(stripeKey);
        this.stripe = stripe;
        const fonts = {
          fonts: [
            {
              cssSrc: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans'
            }
          ]
        };
        const elements = stripe.elements(fonts);
        const style = {
          style: {
            base: {
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: '16px',
              lineHeight: '24px',
              color: '#ffffff',
              '::placeholder': {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          }
        };
        this.cardCvc = elements.create('cardCvc', style);
        this.cardExpiry = elements.create('cardExpiry', style);
        this.cardNumber = elements.create('cardNumber', style);
        this.cardCvc.mount('#card-cvc');
        this.cardExpiry.mount('#card-expiry');
        this.cardNumber.mount('#card-number');
        this.listenForErrors();
      }
    },
    toggleError(event) {
      if (event.error) {
        this.categorizeErrors(event.error.message);
      } else {
        this.clearCardErrors();
      }
    },
    categorizeErrors(errorMessage) {
      if (errorMessage.includes('Your card number')) {
        this.error.cardNumberError = "THIS NUMBER DOESN'T LOOK RIGHT";
      } else if (errorMessage.includes("Your card's expiration")) {
        this.error.cardExpiryError = 'INVALID EXPIRATION DATE';
      } else if (errorMessage.includes("Your card's security")) {
        this.error.cardCvcError = 'INVALID SECURITY CODE';
      } else {
        this.error.stripeError = errorMessage;
      }
    },
    validateToSendToken() {
      this.clearCardErrors();
      let valid = true;
      if (this.savedCardIsSelected) {
        this.emitPurchase();
        return;
      }
      if (!this.card.number) {
        valid = false;
        this.error.cardNumberError = 'Card number is required.';
      }
      if (!this.card.cvc) {
        valid = false;
        this.error.cardCvcError = 'CVC is required.';
      }
      if (!this.card.expiry) {
        valid = false;
        this.error.cardExpiryError = 'Expiration is required.';
      }
      if (this.error.stripeError) {
        valid = false;
      }
      if (valid) {
        this.emitPurchase();
      }
    },
    emitPurchase() {
      let paymentInfo;
      if (this.selected != 'New card') {
        paymentInfo = {
          cardNumber: null,
          error: null,
          stripe: null,
          success: false,
          token: '',
          last4: this.selected.split(' ')[1]
        };
        this.$eventBus.$emit('purchase', { paymentInfo });
      } else {
        paymentInfo = {
          cardNumber: this.cardNumber,
          error: null,
          stripe: this.stripe,
          success: false,
          token: ''
        };
        this.$eventBus.$emit('purchase', { paymentInfo });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sales-payment-info {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 310px;
}

.pim__dropdown {
  width: 136px;
  z-index: 10;
  transition: height 300ms;
  &.expanded-height {
    height: 84px;
    margin-bottom: -12px;
    transition: height 300ms;
  }
}

.pim__card {
  position: absolute;
  top: 50px;
  left: 0px;
  width: inherit;
  height: 222px;
  padding: 10px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.3);
}

form {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.input {
  display: block;
  padding: 10px;
  outline: none;
  border: none;
  border-radius: 6px;
  background-color: #a0aec0;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.55);
  z-index: 2;
}

.pim-cta {
  height: 40px;
}
</style>
