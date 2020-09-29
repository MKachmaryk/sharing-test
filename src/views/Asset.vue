<template>
  <matrix-container id="asset-view">
    <template v-slot:default="slotProps">
      <AssetGrid :lower-state="slotProps.lowerTrayState" />
    </template>
  </matrix-container>
</template>

<script>
import AssetGrid from '@/components/modules/AssetGrid.vue';
import MatrixContainer from '@/components/layout/MatrixContainer.vue';

export default {
  name: 'Asset',
  components: {
    AssetGrid,
    MatrixContainer
  }
};
</script>

<style lang="scss" scoped>
</style>