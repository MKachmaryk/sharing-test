<template>
  <div
    v-if="mainQa.answers"
    class="qa-module-detail"
  >
    <div class="h2 mb-xl">
      LET'S TALK ABOUT {{ item.name }}
    </div>
    <div class="w-full flex justify-end">
      <Button
        class="mt-xl mb-lg"
        bg-color="purple-light"
        :text="`TOGGLE TO QUESTIONS ABOUT ${selectedGroup === 'ensemble' ? 'SERIES' : 'ENSEMBLE'}`"
        @click="toggleGroup"
      />
    </div>
    <div class="flex flex-col justify-center sm:justify-between sm:flex-row w-full">
      <div class="w-full sm:w-1/2">
        <div class="h5 mb-md text-center">
          ABOUT {{ item.name }}
        </div>
        <QuestionComponent
          v-for="question in mainQa.questions"
          :key="'q-' + question.id"
          class="mb-5"
          :question="question"
        />
      </div>
      <div class="w-full sm:w-1/2 sm:ml-8">
        <div class="h5 mb-md text-center">
          ABOUT {{ groupName }}
        </div>
        <QuestionComponent
          v-for="question in allQa[selectedGroup].questions"
          :key="'q-' + question.id"
          class="mb-5"
          :question="question"
        />
      </div>
    </div>
    <Button
      class="mt-xl mb-lg"
      :bg-color="showAskTool ? 'dark-100' : 'purple-light'"
      :color="showAskTool ? 'purple-500' : 'black'"
      text="ASK A QUESTION"
      @click="showAskTool = !showAskTool"
    />
    <AskTool v-if="showAskTool" class="mb-md" @asked="updateQuestions" />
  </div>
</template>

<script>
import AskTool from '@/components/qa/AskTool.vue';
import Button from '@/components/buttons/Button.vue';
import QuestionComponent from '@/components/qa/QuestionComponent.vue';

export default {
  name: 'QaModuleDetail',
  components: {
    AskTool,
    Button,
    QuestionComponent
  },
  data() {
    return {
      showAskTool: false,
      selectedGroup: 'ensemble',
    }
  },
  computed: {
    allQa() {
      return this.$store.state.qa;
    },
    mainQa() {
      return this.$store.state.qa[this.$route.name];
    },
    userId() {
      return this.$store.state.user.id;
    },
    askedByYou() {
      return this.mainQa.questions.filter(q => q.from.id == this.userId);
    },
    about() {
      const { entity, unit } = this.$store.state;
      const on = entity || unit;
      return this.mainQa.questions.filter(q => q.entity_id == on.entity_id);
    },
    inbox() {
      const { questions: qs } = this.mainQa;
      return qs.filter(q => {
        const condition = (a) => (a.user.id == this.userId) && !a.body;
        const inbox = q.answers.filter(a => condition(a));
        return Boolean(inbox.length);
      });
    },
    item() {
      const { name } = this.$route;
      const item = name === 'asset' ? 'unit' : 'profile';
      return this.$store.state[item];
    },
    groupName() {
      const project = this.$route.name === 'asset'
        ? this.$store.state.unit.project
        : this.profile.units[0].project;
      
      return project[this.selectedGroup].name;
    },
  },
  methods: {
    toggleGroup() {
      this.selectedGroup = this.selectedGroup === 'ensemble' ? 'series' : 'ensemble';
    },
    updateQuestions() {
      this.showAskTool = false;
      const item = this.$route.name;
      this.$store.dispatch('loadQa', { entityId: this.$store.state[item].entity_id, entityType: 'asset' });
    }
  }
}
</script>

<style lang="scss" scoped>
.qa-module-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 32px 20px;
}

</style>