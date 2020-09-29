<template>
  <div
    class="relative quote-module grid grid-cols-2 sm:flex justify-between items-start w-full max-w-screen-lg"
  >
    <ActionButton v-bind="buttons[0]" class="row-start-2" @click="$emit('left-button-click')" />
    <QuoteCard
      class="row-start-1 col-span-2 sm:w-1/2 mb-md sm:mb-0"
      :text="quoteText"
      :group="quoteAuthor"
    />
    <Button
      v-if="editable"
      bg-color="purple-light"
      color="black"
      class="absolute top-0 flex-none shadow-lg"
      icon="cog"
      style="left: 20%; z-index: 2;"
      @click="showEditor = true"
    />
    <TextEditorCard
      v-if="showEditor"
      bg-color="white"
      class="absolute inset-0 flex-none"
      :erred="editorError"
      :succeeded="editorSuccess"
      field="quote"
      :value="updatedText"
      @close="onEditorClose"
      @input="updatedText = $event"
      @save="onEditorSave"
    />
    <ActionButton v-bind="buttons[1]" class="row-start-2" @click="$emit('right-button-click')" />
  </div>
</template>

<script>
import ActionButton from '@/components/buttons/ActionButton.vue';
import Button from '@/components/buttons/Button.vue';
import QuoteCard from '@/components/items/QuoteCard.vue';
import TextEditorCard from '@/components/inputs/TextEditorCard.vue';

export default {
  name: 'QuoteModule',
  components: {
    ActionButton,
    Button,
    QuoteCard,
    TextEditorCard
  },
  props: {
    editable: { type: Boolean, default: false },
    quoteText: String,
    quoteType: String,
    quoteAuthor: Object,
    buttons: Array
  },
  data() {
    return {
      showEditor: false,
      editorError: false,
      editorSuccess: false,
      updatedText: ''
    };
  },
  mounted() {
    this.updatedText = this.quoteText;
  },
  methods: {
    onEditorClose() {
      this.showEditor = false;
      this.updatedText = this.quoteText;
    },
    async onEditorSave() {
      const entityType = this.quoteAuthor.type;
      const entityId = this.quoteAuthor.entity_id;
      console.log({ entityType, entityId });
      try {
        const url = `/${entityType}?entity_id=eq.${entityId}`;
        const update = { [this.quoteType]: this.updatedText };
        await this.$pg.patch(url, update);
        this.editorSuccess = true;
        await this.setPause(1000);
        this.$store.dispatch('loadProfile', this.$route.params).then(() => {
          this.showEditor = false;
          this.editorError = false;
          this.editorSuccess = false;
        });
      } catch (err) {
        // eslint-disable-next-line
        console.log({ err });
        this.editorError = true;
        this.$NProgress.done();
        setTimeout(() => (this.editorError = false), 3000);
      }
    }
  }
};
</script>

.<style lang="scss" scoped>
.quote-module {
  grid-template-rows: minmax(min-content, max-content);
  justify-items: center;
}
</style>