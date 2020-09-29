<template>
  <div v-if="copy" class="support-card flex-none flex flex-col justify-between w-full bg-white p-3">
    <div>
      <div class="h5 mb-2">
        {{ supportHeader }}
      </div>
      <div class="caption">
        {{ supportSubheader }}
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div class="sc-bar bg-white border relative h-8 flex-none mb-2 caption">
        <div class="bg-green-200 h-full" :style="`width: ${progressPct};`" />
        <div class="tick tick--25"></div>
        <div class="tick text tick--25">25%</div>
        <div class="tick tick--50"></div>
        <div class="tick text tick--50">50%</div>
        <div class="tick tick--75"></div>
        <div class="tick text tick--75">75%</div>
      </div>
      <div class="pie-wrapper">
        <canvas :id="`pie-chart-${projectId}`" width="100" height="100"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import Chart from 'chart.js';

  export default {
    name: 'SupportCard',
    components: { Button },
    props: {
      bundle: Object,
      budget: Array,
      projectId: Number,
      ensembleName: String,
      seriesName: String,
      ensembleShare: [Number,String],
    },
    computed: {
      copy() {
        return this.$store.state.copy;
      },
      revenue() {
        return this.bundle.price * this.bundle.sales.length;
      },
      budgetTotal() {
        return this.budget.reduce((a, b) => a + b.amount, 0);
      },
      progress() {
        const p = parseInt((this.revenue / this.budgetTotal) * 100);
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
        const inv = this.budgetTotal / 100;
        return inv.toLocaleString('en-US', currencyFormat);
      },
      financialStatus() {
        let status;
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
      supportHeader() {
        const options = {
          first: "You'll be the first Supporter",
          early: 'Early contributor',
          almost: 'Almost there!',
          even: 'We did it!'
        };
        
        return this.copy[`support_cta_header_${this.financialStatus}`];
      },
      supportSubheader() {
        const options = {
          first:
            'These folks don’t make any money until funds are recouped. Let’s get them into the black.',
          early:
            'These folks don’t make any money until funds are recouped. Let’s get them into the black.',
          almost: `All sales go to ${this.seriesName} until funds are recouped. Let’s get them into the black.`,
          even: `This project is now self-sustaining. Your contribution will be shared by  ${this.ensembleName} and ${this.seriesName}.`
        };
        return this.copy[`support_cta_subheader_${this.financialStatus}`];
      }
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        const ensembleShare = parseInt(this.ensembleShare);
        const seriesShare = 100 - parseInt(this.ensembleShare);
        console.log({ ensembleShare, seriesShare, id: this.projectId })
        new Chart(document.getElementById(`pie-chart-${this.projectId}`), {
          type: 'pie',
          data: {
            labels: ['Series share', 'Artist share'],
            datasets: [
              {
                backgroundColor: ['#e2e8f0', '#c8eeff'],
                data: [seriesShare, ensembleShare],
                borderWidth: [0, 0]
              }
            ]
          },
          options: {
            legend: { display: false }
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
.support-card {
  max-width: 500px;
}

.sc-bar {
  width: calc(100% - 108px);
}

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
</style>