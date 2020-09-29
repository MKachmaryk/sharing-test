<template>
  <div class="quote-card flex flex-col p-2">
    <div class="mb-md">{{ text || defaultText }}</div>
    <Card
      :header="group.members ? group.members[0].name : group.name"
      :subheader="group.members ? `Member, ${group.name}` : ''"
      :image="group.members ? group.members[0].image_url : group.image_url"
      text-right
      format="person"
    />
  </div>
</template>

<script>
import Card from '@/components/items/Card.vue';

export default {
  name: 'QuoteCard',
  components: { Card },
  props: {
    text: {
      type: String,
      default: 'This is a description of our mission statement.'
    },
    group: { type: Object, required: true }
  },
  data() {
    return {
      defaultText: 'This is a description of our mission statement.'
    };
  }
};
</script>

<style lang="scss" scoped></style>
