<template>
  <div class="qa-preview-summary">
    <div class="qp__text">
      <div :class="['caption', `text${qColor}`]">
        {{ questionsCount }} Q{{ this.small ? '' : 'UESTIONS' }}
      </div>
      <div :class="['caption', `text${aColor}`]">
        {{ answersCount }} A{{ this.small ? '' : 'NSWERS' }}
      </div>
    </div>
    <div class="qp__summary-bar-wrap">
      <div>
        <div
          :class="['summary-bar', `bg${qColor}`]" 
          :style="calcBarLength('q')"
        />
      </div>
      <div>
        <div
          :class="['summary-bar', `bg${aColor}`]"  
          :style="calcBarLength('a')"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QaPreviewSummary',
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    answersCount: {
      type: Number,
      required: true,
    },
    questionsCount: {
      type: Number,
      required: true,
    },
  },
  computed: {
    qColor() {
      return this.small ? '-black' : '-purple-600';
    },
    aColor() {
      return this.small ? '-gray' : '-green-600';
    },
    maxWidth() {
      return this.small ? 250 : 375;
    }
  },
  methods: {
    calcBarLength(stat) {
      const quantity = stat == 'q' ? this.questionsCount : this.answersCount;
      const unitLength = this.small ? 10 : 15; // this is ~3 in the spec
      const max = 0.38 * this.maxWidth;
      const length = Math.min(max, quantity * unitLength);

      return { maxWidth: `${length}px` };
    },
  },
};
</script>

<style lang="scss" scoped>
.qa-preview-summary {
  display: flex;
  flex-grow: 1;
}

.qp__text {
  display: flex;
  flex: 1 0 content;
  flex-direction: column;
  // flex: 0.75;
  align-items: flex-start;
  justify-content: center;
  min-width: 36px;
  padding-right: 4px;
  > div {
    display: flex;
    align-items: center;
  }
}

.qp__summary-bar-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 28px;
  width: 100%;
  > div {
    height: 14px;
    padding-top: 4px;
  }
}

.summary-bar {
  height: 6px;
  border-radius: 3px;
}
</style>
