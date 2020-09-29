<template>
  <div class="pie-chart">
    <div class="absolute inset-0 flex justify-between items-center p-3">
      <Avatar
        align="start"
        bg-color="blue"
        class="self-start"
        :header="ensembleName"
        subheader="Artist share"
        :tertiaryText="displayEnsembleShare"
        text-size="body-mobile"
      />
      <div class="pie-wrapper">
        <canvas id="pie-chart" width="210" height="210"></canvas>
      </div>
      <Avatar
        align="end"
        class="self-end"
        :header="seriesName"
        subheader="Series share"
        :tertiary-text="displaySeriesShare"
        text-size="body-mobile"
      />
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/items/Avatar.vue';
import Chart from 'chart.js';

export default {
  name: 'ProfitShare',
  components: { Avatar },
  props: {
    ensembleName: { type: String, default: 'Ensemble' },
    ensembleShare: { type: [String, Number], default: 50 },
    seriesName: { type: String, default: 'Series' }
  },
  computed: {
    displayEnsembleShare() {
      const pct = Math.trunc(parseInt(this.ensembleShare));
      return `${pct}%`;
    },
    displaySeriesShare() {
      const pct = Math.trunc(100 - parseInt(this.ensembleShare));
      return `${pct}%`;
    }
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ensembleShare = parseInt(this.ensembleShare);
      const seriesShare = 100 - parseInt(this.ensembleShare);
      new Chart(document.getElementById('pie-chart'), {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.pie-chart {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding-top: 75%;
  background-color: white;
  @include min-width(420) {
    height: 340px;
    padding-top: 0;
  }
}

.pie-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  @include min-width(420) {
    width: 210px;
    max-height: 210px;
  }
}

#pie {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
</style>