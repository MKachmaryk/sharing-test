<template>
  <div class="relative w-full">
    <!-- <div class="bar bg-yellow-light" /> -->
    <div class="ac-body">
      <div class="body mb-sm">
        {{ body }}
      </div>
      <Card
        class="flex-shrink"
        format="person"
        :image="author.image_url"
        :header="author.name"
        text-right
        @click="goToProfilePage(author.entity_id)"
      />
    </div>
  </div>
</template>

<script>
import Card from '@/components/items/Card.vue';


export default {
  name: 'AnswerCard',
  components: {
    Card,
  },
  props: {
    answerId: Number,
    author: Object,
    body: String,
    isPinned: Boolean,
  },
  data() {
    return {
      editing: false,
    };
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
.bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
}

.ac-body {
  width: calc(100% - 10px);
  margin-left: 10px;
  padding: 10px;
  background-color: transparent;
}
</style>
