<template>
  <div
    class="quote-card"
    :class="`quote-card--${variant}`"
    @click="$emit('click')"
  >
    <div class="body mb-sm">
      {{ body }}
    </div>
    <div class="flex justify-between w-full">
      <Card
        class="flex-shrink mr-xs"
        format="person"
        :image="author.image_url"
        :header="author.name"
        text-right
        @click="goToProfilePage(author.entity_id)"
      />
      <Button
        :disabled="!hasAnswers"
        bg-color="fog-700"
        :icon="`chevron-${direction}`"
        round
        style="float: right;"
        @click="$emit('toggle-answer-list')"
      />
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import Card from '@/components/items/Card.vue';

export default {
  name: 'QuoteCard',
  components: {
    Button,
    Card
  },
  props: {
    itemId: Number,
    author: Object,
    body: String,
    hasAnswers: Boolean,
    showAnswers: Boolean,
    variant: { type: String, default: 'quote' }
  },
  computed: {
    direction() {
      return this.showAnswers && this.hasAnswers ? 'up' : 'down';
    }
  },
  methods: {
    goToProfilePage() {
      this.$router.push({
        name: 'profile',
        params: { entityType: 'user', entityId: this.author.entity_id }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.quote-card {
  position: relative;
  width: 100%;
  padding: 10px;
  background-color: white;
}

.quote-card--qa {
  border-radius: 10px;
  border: 1px solid black;
}
</style>
