<template>
  <div
    :class="`flex flex-col text-xs sm:text-base items-${align} w-${rem}`"
    @click="$emit('click')"
  >
    <div
      :class="[
        `w-${rem}`,
        `h-${rem}`,
        'avatar',
        `bg-${bgColor}`,
        'cursor-pointer',
        { 'avatar--square': square },
        { 'mb-sm': header || subheader }
      ]"
    >
      <div v-if="number" class="w-full h-full flex justify-center items-center z-10 button">
        +{{number}}
      </div>
      <img v-if="src" draggable="false" :src="src" />
    </div>
    <div
      v-if="header"
      :class="[
        'font-bold',
        'break-words',
        'cursor-pointer',
        textSize,
        `text-${align}`
      ]"
    >{{ header }}</div>
    <div
      v-if="subheader"
      :class="['italic', 'break-words', textSize, `text-${align}`]"
    >{{ subheader }}</div>
    <div v-if="tertiaryText" :class="['italic', textSize, `text-${align}`]">{{ tertiaryText }}</div>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    align: { type: String, default: 'center' },
    bgColor: { type: String, default: 'gray-200 ' },
    header: { type: String, default: '' },
    subheader: { type: String, default: '' },
    tertiaryText: { type: String, default: '' },
    size: { type: String, default: 'xs' },
    src: { type: String, default: '' },
    square: { type: Boolean, default: false },
    textSize: { type: String, default: 'body' },
    number: { type: Number, default: null }
  },
  computed: {
    rem() {
      const options = {
        xs: '6',
        sm: '8',
        md: '12',
        lg: '16',
        xl: '24',
        '2xl': '32',
        '3xl': '48',
        '4xl': '64'
      };
      return options[this.size];
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.avatar--square {
  border-radius: 0;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}
</style>
