<template>
  <div>
    <QuoteCard
      :item-id="question.id"
      :author="question.from"
      :body="question.body"
      class="mb-xs"
    />
  </div>
</template>

<script>
import QuoteCard from '@/components/qa/QuoteCard.vue';

export default {
  name: 'QaCard',
  components: {
    QuoteCard
  }
}
</script>

<style lang="scss" scoped>

</style>