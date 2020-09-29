<template>
  <div :class="['recipients-card', { 'is-expanded': expanded }]">
    <div
      v-if="!expanded"
      class="flex items-center"
    >
      <div class="caption text-dark-500 mr-sm">
        {{ summaryCaption }}
      </div>
      <Avatar
        v-for="(user, i) in otherUsers"
        :key="`recipient-${user.id}-${i}`"
        :class="{ 'mr-xs': i < (users.length - 1)}"
        size="xs"
        :src="user.image_url"
        @click="goToProfilePage(user.entity_id)"
      />
    </div>
    <div
      v-else
      class="flex-col"
    >
      <div class="h6">
        Sent to:
      </div>
      <Card
        v-for="(user, i) in users"
        :key="`recipient-${user.id}-${i}`"
        :class="{ 'mb-xs': i < (users.length - 1)}"
        :image="user.image_url"
        :header="user.name"
        text-right
        @click="goToProfilePage(author.entity_id)"
      />
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/items/Avatar.vue';
import Card from '@/components/items/Card.vue';

export default {
  name: 'RecipientsCard',
  components: {
    Avatar,
    Card
  },
  props: {
    users: Array,
    showDetail: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      expanded: null,
    };
  },
  created() {
    this.expanded = this.showDetail;
  },
  computed: {
    summaryCaption() {
      const userIds = this.users.map(u => u.id);
      return userIds.includes(this.$store.state.user.id)
        ? 'For you + '
        : 'For: ';
    },
    otherUsers() {
      return this.users.filter(u => u.id != this.userId);
    },
    userId() {
      return this.$store.state.user.id;
    }
  },
  methods: {
    goToProfilePage(entityId) {
      this.$router.push({
        name: 'profile',
        params: { entityType: 'user', entityId }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.recipients-card {
  position: relative;
  width: 100%;
  padding: 5px;
  background-color: white;
}

.is-expanded {
  padding: 10px;
}
</style>
