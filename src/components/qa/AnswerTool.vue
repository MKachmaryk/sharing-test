<template>
  <div class="answer-card">
    <div class="bar bg-yellow-light" />
    <div class="body">
      <div class="h6 mb-sm">
        Your answer:
      </div>
      <textarea
        v-model="answerInput"
        class="qa-bubble-card mb-sm"
        placeholder="Add your answer"
      />
      <div
        v-if="editing"
        class="settings"
      >
        <div class="caption text-dark-500 mb-sm">
          Your answer will be visible on Motive wherever it’s relevant
        </div>
        <div class="nc-checkbox mb-sm">
          <label
            class="nc-checkbox-text"
            for="pinned-checkbox"
          >
            Show on my profile
            <input
              v-model="pinned"
              class="nc-input"
              id="pinned-checkbox"
              type="checkbox"
            >
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
      <div class="flex justify-end">
        <Button
          :bg-color="editing ? 'black' : 'dark-100'"
          class="mr-sm"
          icon="cog-outline"
          :color="editing ? 'white' : 'black'"
          @click="editing = !editing"
        />
        <Button
          :disabled="!answerInput || answered || errored"
          :bg-color="errored ? 'red-light' : 'green-light'"
          :text="btnText"
          @click="handleAddAnswer"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';


export default {
  name: 'AnswerTool',
  components: {
    Button
  },
  props: {
    answerId: Number,
    questionId: Number,
  },
  data() {
    return {
      answered: false,
      answerInput: '',
      editing: false,
      errored: false,
      pinned: false,
    };
  },
  computed: {
    btnText() {
      if (this.answered) return 'Success!';
      if (this.errored) return 'Error!';
      return 'Send';
    },
    update() {
      return {
        // id: this.answerId,
        // question_id: this.questionId,
        // user_id: this.$store.state.user.id,
        body: this.answerInput,
        // is_pinned: this.pinned,
      };
    },
    insert() {
      return {
        question_id: this.questionId,
        user_id: this.$store.state.user.id,
        body: this.answerInput,
        is_pinned: this.pinned,
      };
    }
  },
  methods: {
    async handleAddAnswer() {
      this.$emit('loading', true);
      console.log('handling add answer');
        
      const body = this.answerId ? this.update : this.insert;
      const url = this.answerId
        ? `/question_answer?id=eq.${this.answerId}`
        : '/question_answer';
      const method = this.answerId ? 'patch' : 'post';
      try {
        
        const headers = { Prefer: 'resolution=merge-duplicates,return=representation' };
        const { data } = await this.$pg.request({ url, method, data: body, headers });
        console.log({ data });
        if (data.length) {
          this.answered = true;
          this.$emit('answered');
        }
      } catch (error) {
        this.$emit('loading', false);
        console.log({ error: error.response.data });
        this.errored = true;
        this.$NProgress.done();
        setTimeout(() => {
          this.errored = false;
        }, 3000);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.answer-card {
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
  padding: 10px;
  background-color: white;
}

textarea {
  position: relative;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 0.5px solid black;
  resize: none;
  // :first-child {
  //   padding-bottom: 5px;
  // }
}

::placeholder {
  color: rgba(0,0,0,0.3);
}
</style>
