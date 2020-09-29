<template>
  <div v-if="qa" class="qa-preview">
    <QaPreviewSummary
      v-if="questions.length"
      :answers-count="answersCount"
      :questions-count="qa.summary.questions_count"
    />
    <div v-else-if="qa.error" class="caption text-fog-500">Error loading Questions</div>
    <div v-else class="caption text-dark-500">No questions yet --------</div>
    <div class="triangle" />
  </div>
</template>

<script>
import QaPreviewSummary from '@/components/qa/QaPreviewSummary.vue';

export default {
  name: 'QaPreview',
  components: {
    QaPreviewSummary
  },
  computed: {
    qa() {
      return this.$store.state.qa[this.$route.name];
    },
    answersCount() {
      let as = this.qa.questions.map(q => q.answers);
      as = this.$_.flattenDeep(as);
      return as.filter(a => a.body).length;
    },
    questions() {
      return this.qa.questions || null;
    }
  },
  methods: {
    togglelowerTrayState() {
      console.log('toggle-lower-tray');
      const criteria =
        this.qa.error || !this.questions || !this.questions.length;
      if (criteria) return;
      this.$eventBus.$emit('toggle-lower-tray-state', 'active');
    }
  }
};
</script>

<style lang="scss" scoped>
.qa-preview {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: 4px 20px 0 20px;
  height: 100%;
}

.qa-preview__stats-summary {
  display: flex;
  flex-direction: column;
  flex: 0.75;
  align-items: flex-start;
  justify-content: center;
  > div {
    display: flex;
    align-items: center;
  }
}

.summary-bar-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 32px;
  width: 100%;

  > div {
    height: 16px;
    padding-top: 4px;
  }
}

.summary-bar {
  height: 6px;
  border-radius: 3px;
}

.triangle {
  position: absolute;
  right: 0;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #444;
  margin-top: -2px;
}
</style>
