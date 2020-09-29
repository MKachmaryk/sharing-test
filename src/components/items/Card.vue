<template>
  <div :class="cardClasses" @click="$emit('click')">
    <Avatar v-if="format === 'person'" :src="image" />
    <ImageContainer
      v-else-if="image"
      class="w-full card-image"
      :avatar="format === 'person'"
      :src="image"
    />
    <div :class="['card-text', 'body', format === 'person' ? 'pl-2' : 'p-3']">
      <div :class="{ 'font-bold': format !== 'media' }">
        {{ header }}
      </div>
      <div
        v-if="subheader"
        :class="[{ italic: format === 'entity' }, { 'mb-md': supportingText }]"
      >
        {{ subheader }}
      </div>
      <div v-if="supportingText" class="caption">
        {{ supportingText }}
      </div>
      <div v-if="metadata" class="caption text-dark-500">
        {{ metadata.join('\xa0\xa0\xa0') }}
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/items/Avatar.vue';
import ImageContainer from '@/components/items/ImageContainer.vue';

export default {
  name: 'Card',
  components: { Avatar, ImageContainer },
  props: {
    header: { type: String, required: true },
    subheader: { type: String, default: '' },
    supportingText: { type: String, default: '' },
    metadata: { type: Array, default: null },
    image: { type: String, default: '' },
    textRight: { type: Boolean, default: false },
    format: {
      type: String,
      default: 'entity'
      // validator(val) {
      //   return ['media', 'person', 'entity'].indexOf(value) !== -1
      // }
    }
  },
  computed: {
    cardClasses() {
      // return '';
      const typeClasses =
        this.format === 'person'
          ? 'bg-transparent items-center'
          : 'bg-white w-full sm:max-w-md';
      const flex = this.textRight ? 'flex-row' : 'flex-row-reverse';
      const mediaClass = this.metadata ? 'card--media-item' : '';
      return `card relative flex ${flex} ${mediaClass} ${typeClasses}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.card-text {
  overflow-x: hidden;
  flex: 1 1 auto;
  > div {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.card-image {
  max-width: 33%;
  flex: 1 1 auto;
}

.card--media-item {
  height: 75px;
  .card-image {
    width: 75px;
  }
}

.in-asset-card {
  height: 50px !important;
  background-color: transparent !important;
}
.in-asset-card > .card-text {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
</style>
