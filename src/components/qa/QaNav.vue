<template>
  <div
    v-if="$store.state.qa"
    class="qa-nav"
    @click="toggleQaModuleState"
  >
    <div class="h3-mobile text-black">
      Commentary
    </div>
    <QaPreview class="qh__preview" />
  </div>
</template>

<script>
import QaPreview from '@/components/qa/QaPreview.vue';

export default {
  name: "QaNav",
  components: {
    QaPreview
  },
  props: {
    lowerTrayState: {
      type: String,
      default: 'preview',
    },
  },
  computed: {
    qa() {
      return this.$store.state.qa[this.$route.name];
    },
    qs() {
      return this.qa.questions || null;
    },
    ctaBtnText() {
      return this.qs.length
        ? 'ASK A QUESTION'
        : 'ASK THE FIRST';
    },
    unitId() {
      return this.$store.state.unit.id;
    }
  },
  methods: {
    toggleQaModuleState() {
      console.log('toggle-lower-tray');
      const criteria = !this.qs || this.qa.error;
      if (criteria) return;
      if (this.lowerTrayState !== 'preview') {
        this.$eventBus.$emit('toggle-lower-tray-state', 'preview');
        return;
      }
      this.$eventBus.$emit('toggle-lower-tray-state', 'active');
    },
  },
};
</script>

<style lang="scss" scoped>
.qa-nav {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  padding: 0px 20px;
}

.qh__preview {
  display: none;
  opacity: 0;
  flex-shrink: 0;
  flex-grow: 1;
  min-width: 320px;
  @include for-size(tablet-portrait-up) {
    display: flex;
    opacity: 1;
    transition: opacity 300ms ease;
  }
}
</style>
