<template>
  <div
    :class="`group-card--${type}`"
    class="group-card flex flex-col justify-between mx-auto p-4 bg-white"
  >
    <div class="flex justify-between w-full">
      <div class="w-full mr-1">
        <div
          class="h5 mb-1 cursor-pointer"
          @click="$router.push({
            name: 'profile',
            params: { entityType: type, entityId: group.entity_id }
          })"
        >
          {{ group.name }}
        </div>
        <div class="button">
          {{ label }} 
        </div>
        <div class="button">
          {{ group.location }}
        </div>
      </div>
      <Avatar
        size="lg"
        :src="group.image_url"
          @click="$router.push({
            name: 'profile',
            params: { entityType: type, entityId: group.entity_id }
          })"
      />
    </div>
    <div v-if="type === 'series'" class="flex justify-around items-start w-full">
      <Avatar
        v-for="(unit, i) in units.slice(0,3)"
        :key="`${group.entity_id}-${unit.id}`"
        class="flex-none"
        :class="i < (units.slice(0,3).length - 1) ? 'mr-3' : ''"
        size="xl"
        square
        :src="unit.image_url"
        @click="$router.push({
          name: 'asset',
          params: { id: unit.id }
        })"
      />
      <Avatar
        v-if="displayedMembers.length > 3"
        size="md"
        :number="displayedMembers.slice(3).length"
      />
    </div>
    <div v-if="type === 'ensemble'" class="flex flex-col w-full overflow-y-scroll pt-4">
      <div v-if="group.qa_mission_statement" class="flex w-full mb-2">
        <Avatar
          class="flex-none mr-3"
          size="md"
          :src="group.members[0].image_url"
          @click="$router.push({
            name: 'profile',
            params: { entityType: 'user', entityId: group.members[0].entity_id }
          })"
        />
        <div class="caption break-words">
          {{ group.qa_mission_statement }}
        </div>
      </div>
      <div v-if="group.qa_what_we_do" class="flex justify-around items-start w-full mb-2">
        <Avatar
          class="flex-none mr-3"
          size="md"
          :src="group.members[0].image_url"
          @click="$router.push({
            name: 'profile',
            params: { entityType: 'user', entityId: group.members[0].entity_id }
          })"
        />
        <div class="caption break-words">
          {{ group.qa_what_we_do }}
        </div>
      </div>
      <div v-if="group.qa_who_we_are" class="flex justify-around items-start w-full">
        <Avatar
          class="flex-none mr-3"
          size="md"
          :src="group.members[0].image_url"
          @click="$router.push({
            name: 'profile',
            params: { entityType: 'user', entityId: group.members[0].entity_id }
          })"
        />
        <div class="caption break-words">
          {{ group.qa_who_we_are }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/items/Avatar.vue';

export default {
  name: 'GroupCard',
  components: {
    Avatar,
  },
  props: {
    group: Object,
    type: String,
    label: String,
    units: Array,
  },
  computed: {
    displayedMembers() {
      const uniq = this.$_.uniqBy(this.group.members, 'entity_id')
      return uniq;
    }
  }
}
</script>

<style lang="scss" scoped>
.group-card {
  width: 100%;
  max-width: 500px;
  height: 240px;
}

.group-card--ensemble {
  height: 496px;
}

::-webkit-scrollbar {
  width: 17px;
  background-color: transparent;
  display: none;
}
</style>