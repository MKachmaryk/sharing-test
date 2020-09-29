<template>
  <div id="qa-module" class="w-full h-full overflow-y-scroll z-100 bg-fog-700">
    <QaNav :lower-tray-state="lowerTrayState" />
    <QaModuleDetail v-if="isExpanded" />
  </div>
</template>

<script>
import QaNav from '@/components/qa/QaNav.vue';
import QaModuleDetail from '@/components/qa/QaModuleDetail.vue';

export default {
  name: 'QaModule',
  components: {
    QaNav,
    QaModuleDetail,
  },
  props: {
    lowerTrayState: {
      type: String,
      default: 'preview',
    },
  },
  computed: {
    isExpanded() {
      const expandedStates = ['summary', 'active'];
      return expandedStates.includes(this.lowerTrayState);
    },
  },
};
</script>

