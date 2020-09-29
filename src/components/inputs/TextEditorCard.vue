<template>
  <div class="text-editor-card w-full max-w-sm p-4 content-box" :class="`bg-${bgColor}`">
    <div class="h4 mb-md">Editing {{ field }}</div>
    <textarea
      :id="field"
      class="w-full bg-gray-200 appearance-none border border-2 border-gray-200 rounded p-2 focus:outline-none focus:bg-white focus:border-black mb-md flex-grow"
      :class="`text-${textSize}`"
      @input="$emit('input', $event.target.value)"
      :name="field"
      :value="value"
    />
    <div v-if="erred" class="mb-md text-red-500 font-bold">Oops! Please try again.</div>
    <div
      v-if="succeeded && !erred"
      class="mb-md text-green-500 font-bold"
    >{{ field | capitalize }} has been updated.</div>
    <div class="w-full flex justify-between" :class="`bg-${bgColor}`">
      <Button bg-color="red-light" class="mr-xs" text="Cancel" @click="$emit('close')" />
      <Button bg-color="green-light" text="Save" @click="$emit('save')" />
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';

export default {
  name: 'TextEditorCard',
  components: {
    Button
  },
  props: {
    bgColor: { type: String, default: 'fog-700' },
    textSize: { type: String, default: 'body' },
    erred: Boolean,
    succeeded: Boolean,
    field: String,
    value: String
  },
  mounted() {
    this.$store.commit('setEditing', true);
  },
  beforeDestroy() {
    this.$store.commit('setEditing', false);
  }
};
</script>

<style lang="scss" scoped>
textarea {
  resize: none;
  height: 80px;
}

.text-editor-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-height: 216px;
  max-height: 240px;
  height: auto;
  border-radius: 2px;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  opacity: 1;
  z-index: 10000;
  transition: opacity 300ms ease;
}
</style>
