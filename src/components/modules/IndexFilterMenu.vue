<template>
  <div
    id="index-filter-menu"
    class="absolute bottom-0 w-screen flex flex-wrap justify-around items-center p-3 bg-white z-50"
  >
    <div class="flex items-center mr-4 mb-2 xs:mb-0">
      <span class="h6 mr-2">SHOW ME:</span>
      <Button
        v-for="(type, i) in mediaTypes"
        :key="`btn-${type.name}`"
        :bg-color="
          allActive || allInactive || !type.active ? 'dark-200' : 'black'
        "
        :class="{ 'mr-2': i < mediaTypes.length - 1 }"
        :color="allActive || allInactive || !type.active ? 'black' : 'white'"
        :icon="type.icon"
        @click="toggleMedia(type.name)"
      />
    </div>
    <div class="flex items-center">
      <span class="h6 mr-2">ORDER:</span>
      <Button
        v-for="(v, k) in orderIcons"
        :key="`order-btn-${v}`"
        :bg-color="k === sortOrder ? 'black' : 'dark-200'"
        :class="{ 'mr-2': k === 'asc' }"
        :color="k === sortOrder ? 'white' : 'black'"
        :icon="`chevron-${v}`"
        @click="$emit('toggle-sort-order', k)"
      />
    </div>
  </div>
</template>

<script>
import Button from "@/components/buttons/Button.vue";

export default {
  name: "IndexFilterMenu",
  components: { Button },
  props: {
    activeMedia: Array,
    sortOrder: String
  },
  data() {
    return {
      orderIcons: {
        asc: "up",
        desc: "down"
      },
      mediaTypes: [
        {
          name: "playlist",
          icon: "music",
          active: true
        },
        {
          name: "video",
          icon: "movie",
          active: true
        }
      ],
      sort: "asc"
    };
  },
  computed: {
    allActive() {
      return this.mediaTypes.filter(o => o.active).length === 2;
    },
    allInactive() {
      return this.mediaTypes.filter(o => !o.active).length === 2;
    }
  },
  methods: {
    btnBgColor(value) {
      return this.activeMedia.length === 2 || !this.activeMedia.includes(value)
        ? "dark-200"
        : "black";
    },
    btnColor(value) {
      return this.activeMedia.length === 2 || !this.activeMedia.includes(value)
        ? "black"
        : "white";
    },
    toggleMedia(name) {
      // If both are active or inactive, select, make selected one active, and the other inactive;
      // Otherwise, toggle
      const selected = this.mediaTypes.find(o => o.name === name);
      const not = this.mediaTypes.find(o => o.name !== name);
      if (this.activeMedia.length !== 1) {
        selected.active = true;
        not.active = false;
        this.$emit("update-media-filter", [selected.name]);
        return;
      }
      selected.active = true;
      not.active = true;
      const updatedMedia = this.mediaTypes
        .filter(o => o.active)
        .map(o => o.name);
      this.$emit("update-media-filter", updatedMedia);
    }
  }
};
</script>

<style lang="scss" scoped></style>
