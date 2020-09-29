<template>
  <div class="container p-3 flex flex-col items-center">
    <ShareCard />
  </div>
</template>

<script>
import ShareCard from '@/components/items/ShareCard.vue';

export default {
  name: 'Sandbox',
  components: {
    ShareCard
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped></style>
