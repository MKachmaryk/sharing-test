<template>
  <div class="ask-tool">
    <!-- <div class="bar bg-purple-light" /> -->
    <div class="body">
      <div class="ask-card mb-sm">
        <div class="mb-sm">
          You ask:
        </div>
        <textarea
          v-model="question"
          class="w-full bg-gray-100 appearance-none border border-2 border-gray-200 rounded p-2 focus:outline-none focus:bg-white focus:border-black"
          name="ask"
          rows="3"
        />
      </div>
      <RecipientsCard
        :users="recipients"
        class="mb-sm"
      />
      <Button
        :disabled="!question || asked || errored"
        :bg-color="errored ? 'red-light' : 'green-light'"
        :text="btnText"
        @click="handleSendQuestion"
      />
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import RecipientsCard from '@/components/qa/RecipientsCard.vue';

export default {
  name: 'AskTool',
  components: {
    Button,
    RecipientsCard,
  },
  data() {
    return {
      question: '',
      asked: false,
      errored: false,
    }
  },
  computed: {
    btnText() {
      if (this.asked) return 'Success!';
      if (this.errored) return 'Error!';
      return 'SEND YOUR QUESTION';
    },
    item() {
      const { name } = this.$route;
      const item = name === 'asset' ? 'unit' : 'profile';
      return this.$store.state[item];
    },
    recipients() {
      const { members } = this.$route.name === 'asset'
        ? this.item.project.ensemble
        : this.item;
      const result = this.$_.chain(members)
        .groupBy('name')
        .map(function(v, i) {
          return {
            name: i,
            id: _.get(_.find(v, 'id'), 'id'),
            image_url: _.get(_.find(v, 'image_url'), 'image_url'),
            entity_id: _.get(_.find(v, 'entity_id'), 'entity_id'),
            label: _.map(v, 'label')
          };
        })
        .value();
      return result;
    }
  },
  methods: {
    async handleSendQuestion() {
      const headers = { Prefer: 'return=representation' };
      const url = '/question';
      const qBody = { body: this.question, user_id: this.$store.state.user.id, entity_id: this.item.entity_id };

      try {
        const { data } = await this.$pg.request({ url, method: 'post', data: qBody, headers });
        console.log({ data });
        if (data.length) {
          this.asked = true;
          await this.addAnswers(data[0].id);
          this.$emit('asked');
        }
      } catch (error) {
        console.log({ error: error.response.data });
        this.errored = true;
        this.$NProgress.done();
        setTimeout(() => {
          this.errored = false;
        }, 3000);
      }
    },
    async addAnswers(questionId) {
      const aData = this.recipients.map(recipient => {
        return {
          question_id: questionId,
          user_id: recipient.id
        }
      });
      const url = '/question_answer';
      const headers = { Prefer: 'resolution=merge-duplicates,return=representation' };
      try {
        const { data } = await this.$pg.request({ url, method: 'post', data: aData, headers });
        console.log({ data });
      } catch (error) {
        console.log({ error: error.response.data });
        this.errored = true;
        this.$NProgress.done();
        setTimeout(() => {
          this.errored = false;
        }, 3000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ask-tool {
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
