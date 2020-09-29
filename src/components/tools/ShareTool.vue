<template>
  <div class="share-tool--portrait">
    <div class="card-image-wrapper-portrait">
      <img :src="imageUrl" />
    </div>
    <div class="card-body-container">
      <div v-if="title" class="text-heading">
        {{ title }}
      </div>
      <div v-if="description" class="text-title mb-4">
        {{ description }}
      </div>
      <div v-if="ensemble.name" class="list-item">
        <img
          class="avatar" 
          :src="ensemble.image_url" 
        />
        <div class="list-item-text">
          <div class="text-title font-bold"> 
            {{ ensemble.name }}
          </div>  
          <div class="text-title">
            {{ ensemble.description }}
          </div>
        </div>
      </div>
      <div v-if="series.name" class="list-item mb-4">
        <img
          class="avatar" 
          :src="series.image_url" 
        />
        <div class="list-item-text">
          <div class="text-title font-bold"> 
            {{ series.name }}
          </div>  
          <div class="text-title">
            {{ series.description }}
          </div>
        </div>
      </div>
      <div v-if="logo" class="motive-logo">
        <img src="https://res.cloudinary.com/clocks/image/upload/v1586410025/motive/motive-bw-logo.png" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ShareTool',
    props: {
      title: String,
      description: String,
      imageUrl: String,
      ensemble: Object,
      series: Object,
      logo: Boolean,
    }
  }
</script>

<style lang="scss" scoped>
.share-tool--portrait {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 375px;
  height: 660px;
  background-color: #EC9797;
  border-radius: 12px;
}

.card-image-wrapper-portrait {
  flex-shrink: 0;
  position: relative;
  width: 375px;
  height: 375px;
  overflow: hidden;
  margin-bottom: 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background-color: gray;
}

.card-body-container {
  padding: 12px;
}

.avatar {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

img {
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.list-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
  margin-bottom: 8px;
  padding-top: 4px;
  padding-right: 4px;
  padding-bottom: 4px;
  max-height: 64px;
}

.text-heading {
  font-family: 'Space Mono';
  font-size: 24px;
  line-height: 30px;
  font-weight: 700;
}

.list-item-text {
  margin-left: 8px;
}

.text-title {
  font-family: 'Space Mono';
  font-size: 14px;
  line-height: 18px;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 40px;
}

.text-bold {
  font-weight: bold;
}

.mb-2 {
  margin-bottom: 8px !important;
}

.mb-4 {
  margin-bottom: 16px !important;
}

.motive-logo {
  width: 100px; 
  height: 28px; 
  position: absolute; 
  left: 138px; 
  bottom: 8px;
}
</style>