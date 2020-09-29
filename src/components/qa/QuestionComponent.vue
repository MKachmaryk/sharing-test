<template>
  <div class="question-component">
    <div class="question-section">
      <!-- <div class="bar bg-purple-light" /> -->
      <div :class="['body', { 'xs': showAnswers }]">
        <QuoteCard
          :item-id="question.id"
          :author="question.from"
          :body="question.body"
          :has-answers="!!answers.length"
          :show-answers="showAnswers"
          variant="qa"
          class="mb-xs"
          @toggle-answer-list="toggleAnswersList"
        />
      </div>
    </div>
    <transition-group
      name="toggle-item"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <template v-if="showAnswers">
        <AnswerCard
          v-for="answer in answers"
          :key="'a-' + answer.id"
          :answer-id="answer.id"
          :author="answer.user"
          :body="answer.body"
          :is-pinned="answer.is_pinned"
          class="toggle-item mb-xs pt-0"
        />
      </template>
    </transition-group>
  </div>
</template>

<script>
import AnswerCard from '@/components/qa/AnswerCard.vue';
import Button from '@/components/buttons/Button.vue';
import QaSettingsCard from '@/components/qa/QaSettingsCard.vue';
import QuoteCard from '@/components/qa/QuoteCard.vue';
import RecipientsCard from '@/components/qa/RecipientsCard.vue';
import toggleExpansion from '@/helpers/toggle-expansion';

export default {
  name: 'QuestionComponent',
  mixins: [toggleExpansion],
  components: {
    AnswerCard,
    Button,
    QaSettingsCard,
    QuoteCard,
    RecipientsCard,
  },
  props: {
    question: Object,
  },
  data() {
    return {
      editing: false,
      showAnswers: true,
    };
  },
  computed: {
    answers() {
      return this.question.answers.filter(a => a.body);
    },
    textButtonText() {
      const as = this.answers;
      return as.length
        ? `${as.length} ANSWER${as.length > 1 ? 'S' : ''}`
        : 'NO ANSWERS YET';
    }
  },
  methods: {
    toggleAnswersList() {
      this.showAnswers = !this.showAnswers;
      this.editing = false;
    },
    toggleSettings() {
      this.editing = !this.editing;
      this.showAnswers = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.question-component, .question-section {
  position: relative;
  width: 100%;
}

.bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
}

.body {
  width: calc(100% - 10px);
  margin-left: 10px;
}
</style>