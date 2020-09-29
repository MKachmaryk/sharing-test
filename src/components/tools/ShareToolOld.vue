<template>
  <div :class="view === 'portrait' ? 'share-tool--portrait' : 'share-tool--landscape'">
    <div :class="view === 'portrait' ? 'card-image-wrapper-portrait' : 'card-image-wrapper-landscape'">
      <img 
        class="w-full h-full"
        :src="imageUrl" 
      />
    </div>
    <div class="card-body-container">
      <div :class="view === 'portrait' ? 'title' : 'title-landscape'">
        {{title}}
      </div>
      <div  class="ensemble-list-item">
        <DefaultListItem
          :imageUrl="ensemble.image_url"
          :title="ensemble.name"
          :description="ensemble.description"
        />
      </div>
      <div class="list-item">
        <DefaultListItem
          :imageUrl="series.image_url"
          :title="series.name"
          :description="series.description"
          :reverse="true" 
        />
      </div>
      <div class="motive-logo">
        <div class="logo-image-wrapper">
          <img
            :src="require('@/assets/img/motive-bw-logo.png')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultListItem from '@/components/items/DefaultListItem.vue'


export default {
  name: 'ShareTool',
  components: {
    DefaultListItem,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    ensemble: {
      type: Object,
      required: true,    
    },
    series: {
      type: Object,
      required: true,    
    },
    view: {
      type: String,
      default: 'portrait',    
    },
  },
}
</script>

<style>

.share-tool--portrait {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 375px;
  height: 666px;
  background-color: #EC9797;
  border-radius: 12px;
}

.share-tool--landscape {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 675px;
  height: 300px;
  background: #EC9797;
}

.card-image-wrapper-portrait {
  position: relative;
  width: 375px;
  height: 375px;
  overflow: hidden;
  margin-bottom: 32px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-image-wrapper-landscape {
  position: relative;
  width: 300px;
  height: 300px;
  overflow: hidden;
  margin-right: 16px;
}

.card-image-wrapper > img {
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.card-body-container {
  display: flex;
  flex-direction: column;
  align-items: center
}

.title {
  font-family: 'Space Mono';
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #000000;
  margin-left: 20px;
  margin-bottom: 16px;
  align-self: flex-start;
}

.title-landscape {
  font-family: 'Space Mono';
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #000000;
  padding-top: 32px;
  margin-bottom: 16px;
  align-self: flex-start;
}

.ensemble-list-item {
  width: 335px;
  background: rgba(255, 255, 255, 0.3);
  margin-bottom: 16px;
}

.series-list-item {
  width: 335px;
  background: rgba(255, 255, 255, 0.3);
  margin-bottom: 39px;
}

.logo-image-wrapper {
  position: relative;
  width: 102px;
  height: 27px;
}

.logo-image-wrapper > img {
  position:absolute;
}

</style>