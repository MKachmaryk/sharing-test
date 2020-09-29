<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-container w-full max-w-sm bg-fog-700 p-4">
        <div class="h4 mb-md">Editing {{ field }}</div>
        <textarea
          :id="field"
          class="w-full bg-gray-200 appearance-none border border-2 border-gray-200 rounded p-2 focus:outline-none focus:bg-white focus:border-black mb-md"
          @input="$emit('input', $event.target.value)"
          :name="field"
          rows="4"
          :value="value"
        />
        <div class="flex justify-between">
          <Button bg-color="red-light" class="mr-xs" text="Cancel" @click="$emit('close')" />
          <Button bg-color="green-light" text="Save" @click="$emit('save')" />
        </div>
        <div v-if="erred" class="mt-md text-red-500">Oops! Please try again.</div>
        <div
          v-if="succeeded && !erred"
          class="mt-md text-green-500"
        >Your {{ field }} has been updated.</div>
      </div>
    </div>
  </transition>
</template>

<script>
import Button from '@/components/buttons/Button.vue';

export default {
  name: 'TextEditorModal',
  components: {
    Button
  },
  props: {
    erred: Boolean,
    succeeded: Boolean,
    field: String,
    value: String
  }
};
</script>

<style lang="scss" scoped>
textarea {
  resize: none;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  backdrop-filter: blur(10px);
  transition: opacity 300ms ease;
}

.modal-container {
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 200ms ease;
}
</style>
