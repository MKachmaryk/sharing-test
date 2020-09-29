<template>
  <div
    :class="[
      'image-container',
      { 'image-container--square': square },
    ]"
    @click="$emit('click')"
  >
    <img
      draggable="false"
      :src="src"
    >
  </div>
</template>

<script>
  export default {
    name: 'ImageContainer',
    props: {
      src: { type: String, required: true },
      square: { type: Boolean, default: false },
    },
  }
</script>

<style lang="scss" scoped>
.image-container {
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.image-container--square {
  height: 0;
  padding-top: 100%;
}

.image-container--avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
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