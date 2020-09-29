<template>
  <matrix-container id="profile-view">
    <template v-slot:default="slotProps">
      <ProfileGrid :lower-state="slotProps.lowerTrayState" />
    </template>
  </matrix-container>
</template>

<script>
import ProfileGrid from '@/components/modules/ProfileGrid.vue';
import MatrixContainer from '@/components/layout/MatrixContainer.vue';

export default {
  name: 'Profile',
  components: {
    ProfileGrid,
    MatrixContainer
  }
};
</script>

<style lang="scss" scoped>
</style>