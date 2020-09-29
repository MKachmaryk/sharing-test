<template>
  <div class="sales-terms flex flex-col">
    <div class="text-black button">SALES AGREEMENT + LICENSE FAIR USER</div>
    <div class="footnote text-dark-500 mb-md">You must read & agree to continue</div>
    <div class="footnote text-dark-500 mb-lg">
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi."</div>
    <div class="terms-box text-dark-500 mb-xxl">
      {{ copy.sales_agreement_text }}
      <br />
      {{ copy.license_fair_use_text }}
    </div>
    <div class="text-black button mb-sm">Sales Agreement</div>
    <div class="agree-disagree flex justify-between items-center mb-xl">
      <label class="terms-container caption text-dark-500">
        I AGREE
        <input type="radio" id="first-yes" value="yes" v-model="first" />
        <span class="checkmark"></span>
      </label>
      <label class="terms-container no caption text-dark-500">
        I DISAGREE
        <input type="radio" id="first-no" value="no" v-model="first" />
        <span class="checkmark"></span>
      </label>
    </div>
    <div class="text-black button mb-sm">License Fair Use</div>
    <div class="agree-disagree flex justify-between items-center mb-xl">
      <label class="terms-container caption text-dark-500">
        I AGREE
        <input type="radio" id="second-yes" value="yes" v-model="second" />
        <span class="checkmark"></span>
      </label>
      <label class="terms-container no caption text-dark-500">
        I DISAGREE
        <input type="radio" id="second-no" value="no" v-model="second" />
        <span class="checkmark"></span>
      </label>
    </div>
    <div class="text-black button mb-sm">WHOLETONE PROFITSHARE</div>
    <div class="text-dark-500 mb-lg">
      {{ copy.wholetone_profitshare_text }}
    </div>
    <div class="h3 text-black mb-sm">Payment method</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SalesTerms',
  components: {},
  data() {
    return {
      first: false,
      second: false
    };
  },
  computed: {
    ...mapState(['copy']),
  },
  watch: {
    first(newVal, oldVal) {
      if (newVal === 'yes' && this.second === 'yes') {
        this.emitAgreedToTermsEvent();
      }
      if (newVal !== 'yes' && oldVal === 'yes') {
        this.revokeAgreement();
      }
    },
    second(newVal, oldVal) {
      if (newVal === 'yes' && this.first === 'yes') {
        this.emitAgreedToTermsEvent();
      }
      if (newVal !== 'yes' && oldVal === 'yes') {
        this.revokeAgreement();
      }
    }
  },
  methods: {
    emitAgreedToTermsEvent() {
      console.log('emitting yes');
      this.$eventBus.$emit('agreed-to-terms', true);
    },
    revokeAgreement() {
      console.log('emitting no');
      this.$eventBus.$emit('agreed-to-terms', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.terms-box {
  background-color: white;
  border-radius: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 12px;
  max-height: 255px;
  scrollbar-width: 10px !important;
}

.agree-disagree {
  width: 240px;
  margin-left: auto;
  margin-right: auto;
}

.terms-container {
  position: relative;
  width: 110px;
  padding-left: 25px;
  line-height: 17px;
  height: 20px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.terms-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: white;
  border: 1px solid black;
  border-radius: 3px;
}

/* On mouse-over, add a grey background color */
.terms-container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.terms-container input:checked ~ .checkmark {
  background-color: white;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.terms-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.terms-container .checkmark:after {
  top: 0px;
  left: 0px;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: #97ffc7; // green-light
}

.terms-container.no .checkmark:after {
  background: #ffbdbd; // red-light
}

::-webkit-scrollbar {
  width: 17px;
  background-color: transparent;
  display: none;
}
</style>