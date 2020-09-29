<template>
  <div class="question-component">
    <div v-if="!skippedAll" class="question-section">
      <div class="bar bg-purple-light" />
      <div :class="['body', { 'mb-xs': addAnswer }]">
        <QuoteCard
          :item-id="question.id"
          :author="question.from"
          :body="question.body"
          class="mb-xs"
        />
        <RecipientsCard
          :users="question.answers.map(a => a.user)"
          class="mb-xs"
        />
        <div class="flex">
          <Button
            class="mr-xs"
            bg-color="red-light"
            text="SKIP"
            @click="skipQuestion"
          />
          <Button
            :disabled="loading"
            bg-color="green-light"
            text="ANSWER"
            color="black"
            @click="toggleAnswerTool"
          />
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center">
      <div class="h4 mb-sm text-center">
        You've reached the end of your inbox. Back to the beginning?
      </div>
      <Button
        class="mr-xs"
        bg-color="blue-light"
        text="BACK"
        @click="goBack"
      />
    </div>
    <transition
      name="toggle-item"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <template v-if="addAnswer">
        <AnswerTool
          v-if="addAnswer"
          :question-id="question.id"
          :answer-id="answerId"
          class="toggle-item pt-0"
          @answered="incrementQuestion"
          @loading="toggleLoading"
        />
      </template>
    </transition>
  </div>
</template>

<script>
import AnswerTool from '@/components/qa/AnswerTool.vue';
import QuoteCard from '@/components/qa/QuoteCard.vue';
import RecipientsCard from '@/components/qa/RecipientsCard.vue';
import Button from '@/components/buttons/Button.vue';
import toggleExpansion from '@/helpers/toggle-expansion';

export default {
  name: 'QaInbox',
  mixins: [toggleExpansion],
  components: {
    AnswerTool,
    QuoteCard,
    RecipientsCard,
    Button
  },
  props: {
    questions: Array,
  },
  data() {
    return {
      activeIx: 0,
      addAnswer: false,
      loading: false,
      skippedAll: false,
    };
  },
  computed: {
    question() {
      return this.questions[this.activeIx];
    },
    answerId() {
      const myId = this.$store.state.user.id;
      const a = this.question.answers.find(a => a.user.id === myId);
      return a ? a.id : null;
    }
  },
  methods: {
    incrementQuestion() {
      this.addAnswer = false;
      if (this.activeIx === (this.questions.length - 1)) {
        this.skippedAll = true;
      }
      this.activeIx += 1;
      this.loading = false;
    },
    toggleAnswerTool() {
      this.addAnswer = !this.addAnswer;
      console.log({ state: this.addAnswer })
    },
    toggleLoading(payload) {
      this.loading = payload;
    },
    skipQuestion() {
      // TO-DO: SKIP QUESTION...IS_HIDDEN ON NULL ANSWER BY USER?
      this.incrementQuestion();
    },
    goBack() {
      this.activeIx = 0;
      this.skippedAll = false;
      this.loading = false;
      this.addAnswer = false;
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