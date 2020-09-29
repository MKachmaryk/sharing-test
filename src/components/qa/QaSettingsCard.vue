<template>
  <div
    :class="['qa-settings-card', { standalone: padding > 0 }]"
    :style="`padding: ${padding}px;`"
  >
    <div class="caption text-dark-500 mb-sm">
      Your {{ type }} will be visible on Motive wherever it’s relevant
    </div>
    <div
      v-if="deletable"
      class="nc-checkbox mb-sm"
    >
      <label
        class="nc-checkbox-text"
        for="deleted-checkbox"
      >
        Delete this {{ type }}
        <input
          v-model="deleted"
          class="nc-input"
          id="deleted-checkbox"
          type="checkbox"
        >
        <span class="checkmark"></span>
      </label>
    </div>
    <Button
      bg-color="green-light"
      style="align-self: flex-end;"
      text="SAVE"
      @click="saveEdits"
    />
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';

export default {
  name: 'QaSettingsCard',
  components: {
    Button
  },
  props: {
    deletable: {
      type: Boolean,
      default: false,
    },
    isPinned: Boolean,
    padding: {
      type: Number,
      default: 10,
    },
    qaId: Number,
    type: {
      type: String,
      validator(value) {
        return ['question', 'answer', 'input'].indexOf(value) !== -1;
      }
    }
  },
  data() {
    return {
      pinned: false,
      deleted: false,
    };
  },
  mounted() {
    this.pinned = this.isPinned;
  },
  methods: {
    saveEdits() {
      if (this.pinned !== this.isPinned) {
        this.patchItem();
        return;
      }
      if (this.deleted) this.deleteItem();
      this.editing = false;
    },
    async patchItem() {
      const table = this.type === 'question' ? 'question' : 'question_answer';
      const url = `/${table}?id=eq.${this.qaId}`;
      const update = { is_pinned: this.pinned };
      await this.$pg.patch(url, update);
      const data = { id: this.qaId, isPinned: this.pinned };
      if (this.type === 'question') this.$store.commit('updateQuestion', data);
      if (this.type === 'answer') this.$store.commit('updateAnswer', data);
      this.$emit('close');
    },
    deleteItem() {
      // TO-DO: DELETE...
      this.editing = false;
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.qa-settings-card {
  display: flex;
  flex-direction: column;
  background-color: white;
}

.standalone {
  min-height: 146px;
}

.nc-checkbox {
  position: relative;
  height: 38px;
}

.nc-checkbox-text {
  padding-left: 48px;
  line-height: 38px;
}

input.nc-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  height: 38px;
  width: 38px;
  border: 0.5px solid #000000;
  background-color: #eee;
}

.checkmark:hover {
  background-color: rgba(0,0,0,0.1);
}

input.nc-input:checked ~ .checkmark {
  background-color: rgba(0,0,0,0.04);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

input.nc-input:checked ~ .checkmark:after {
  display: block;
}

.nc-checkbox-text .checkmark:after {
  left: 14px;
  top: 8px;
  width: 9px;
  height: 18px;
  border: solid black;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
