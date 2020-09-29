<template>
  <div v-if="copy" class="support-module flex flex-col">
    <div class="bg-white p-3">
      <div class="font-bold">{{ header }}</div>
      <div>{{ subheader }}</div>
    </div>
    <div class="bg-white-stroke relative h-28 flex-shrink sm:flex-grow">
      <div class="bg-orange-light h-full" :style="`width: ${progressPct};`" />
      <div class="tick tick--25"></div>
      <div class="tick text tick--25">25%</div>
      <div class="tick tick--50"></div>
      <div class="tick text tick--50">50%</div>
      <div class="tick tick--75"></div>
      <div class="tick text tick--75">75%</div>
    </div>
    <div
      class="caption bg-white h-12 py-4 text-center"
    >{{ progressPct }} of {{ budgetFormatted }} investment recovered</div>
    <Button
      v-if="buttonText"
      data-test="support-module-btn"
      bg-color="green-light"
      :text="copy.support_btn_text"
      @click="$emit('support')"
    />
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';

export default {
  name: 'SupportModule',
  components: {
    Button
  },
  props: {
    buttonText: { type: String, default: 'SUPPORT THE CREATORS' },
    revenue: { type: Number, default: 500000 },
    budget: { type: Number, default: 1200000 },
    projectId: { type: Number, default: 0 },
    ensemble: {
      type: Object,
      default() {
        return { name: 'Ensemble' };
      }
    },
    series: {
      type: Object,
      default() {
        return { name: 'Series' };
      }
    }
  },
  computed: {
    copy() {
      return this.$store.state.copy;
    },
    progress() {
      const p = parseInt((this.revenue / this.budget) * 100);
      if (this.revenue && p === 0) {
        return 1;
      }
      return p;
    },
    progressPct() {
      return `${parseInt(this.progress)}%`;
    },
    budgetFormatted() {
      const currencyFormat = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      };
      const inv = this.budget / 100;
      return inv.toLocaleString('en-US', currencyFormat);
    },
    financialStatus() {
      if (this.progress === 0) {
        status = 'first';
      } else if (this.progress < 75) {
        status = 'early';
      } else if (this.progress < 100) {
        status = 'almost';
      } else {
        status = 'even';
      }
      return status;
    },
    header() {
      const options = {
        first: "You'll be the first Supporter",
        early: 'Early contributor',
        almost: 'Almost there!',
        even: 'We did it!'
      };
      return this.copy[`support_cta_header_${this.financialStatus}`];
    },
    subheader() {
      const options = {
        first:
          'These folks don’t make any money until funds are recouped. Let’s get them into the black.',
        early:
          'These folks don’t make any money until funds are recouped. Let’s get them into the black.',
        almost: `All sales go to ${this.series.name} until funds are recouped. Let’s get them into the black.`,
        even: `This project is now self-sustaining. Your contribution will be shared by  ${this.ensemble.name} and ${this.series.name}.`
      };
      return this.copy[`support_cta_subheader_${this.financialStatus}`];
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.tick {
  position: absolute;
  bottom: 0;
  height: 8px;
  width: 1px;
  background-color: black;
  z-index: 2;
}

.tick.text {
  bottom: 20px;
  width: 30px;
  background-color: transparent;
}

.tick--25 {
  left: 25%;
}
.tick--50 {
  left: 50%;
}
.tick--75 {
  left: 75%;
}

.bg-white-stroke {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
