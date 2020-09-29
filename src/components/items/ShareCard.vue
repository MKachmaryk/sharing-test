<template>
  <div class="share-card-container">
    <div class="section--image">
      <div class="card-image-wrapper">
        <img 
          :src="item.image_url" 
        />
      </div>
    </div>
    <div class="section--text">
      <div class="section--text__title flex">
        <!-- <div class="icon-wrapper">
          <div class="icon">
            <music-icon
              class="w-full h-full"
            /> 
          </div>
        </div> -->
        <div class="text-h5">
          {{ item.name }}
        </div>
      </div>
      <div :class="descriptionClass">
        {{ item.description }}
      </div>
      <div :class="ensembleListItemClass">
        <div class="avatar-wrapper">
          <img 
            :src="item.ensemble.image_url" 
          />
        </div>
        <div class="list-item-text flex flex-col justify-between ml-2">
          <div class="text-subtitle">
            {{ item.ensemble.name }}
          </div>
          <div class="text-caption">
            ENSEMBLE
          </div>
        </div>
      </div>
      <div :class="seriesListItemClass">
        <div class="avatar-wrapper">
          <img 
            :src="item.series.image_url" 
          />
        </div>
        <div class="list-item-text flex flex-col justify-between ml-2">
          <div class="text-subtitle">
            {{ item.series.name }}
          </div>
          <div class="text-caption">
            SERIES
          </div>
        </div>
      </div>
      <div class="quote w-full">
        <div class="text-body w-full max-height-32 mb-4 ellipsis overflow-hidden">
          {{ item.quote }}
        </div>
        <div class="member-list-item flex">
          <div class="avatar-wrapper">
            <img 
              :src="item.ensemble.members[0].image_url" 
            />
          </div>
          <div class="list-item-text flex flex-col justify-between ml-2">
            <div class="text-subtitle">
              {{ item.ensemble.members[0].name }}
            </div>
            <div class="text-caption">
              Member, {{ item.ensemble.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="motive-logo-wrapper absolute">
        <div class="motive-logo absolute w-full h-full">
          <img 
            src="https://res.cloudinary.com/clocks/image/upload/v1586410025/motive/motive-bw-logo.png" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'ShareCard',
    props: {
      item: Object,
    },
    data() {
      return {
        imageUrl: 'https://picsum.photos/200',
        assetName: "An Outlawz Party" ,
        ensembleName: 'Tha Outlaw Immortalz',
        ensembleImageUrl: 'https://picsum.photos/200',
        seriesName: 'Amaru Entertainment',
        seriesImageUrl: 'https://picsum.photos/200',
        ensembleMemberName: 'Makaveli the Don',
        ensembleMemberImage: 'https://picsum.photos/200',
        motiveLogoPath: '@/assets/img/motive-bw-logo.png'
      }
    },
    computed: {
      descriptionClass() {
        return this.item.type === 'entity' ? 'text-body w-full max-height-16 mb-4' : 'hidden';
      },
      ensembleListItemClass() {
        return this.item.type === 'asset' ? 'ensemble-list-item flex' : 'hidden';
      },
      seriesListItemClass() {
        return this.item.type === 'asset' ? 'series-list-item flex' : 'hidden';
      },
    }
  }
</script>

<style lang="scss" scoped>
.share-card-container {
  position: absolute;
  width: 860px;
  height: 450px;
  background: #F7FAFC;
}

.section--image {
  position: absolute;
  width: 450px;
  height: 450px;
  left: 0px;
  top: 0px;
}

.card-image-wrapper {
  position: absolute;
  width: 386px;
  height: 386px;
  left: 32px;
  top: 32px;
  background: #E2E8F0;
}

.card-image-wrapper > img {
  position: absolute;
  width: 322px;
  height: 322px;
  left: 32px;
  right: 32px;
  top: 32px;
  bottom: 32px;
}

.section--text {
  position: absolute;
  width: 410px;
  height: 450px;
  left: 450px;
  top: 0px;
  padding: 32px;
  background: #F7FAFC;
}

.section--text__title {
  width: 345px;
  align-items: center;
  margin-bottom: 8px;
}

.icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  }

.icon {
  width: 19px;
  height: 18px;
}

.text-h5 {
  font-family: 'Space Mono';
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 36px;
  color: #000000;
  text-transform: capitalize;
}

.ensemble-list-item {
  margin-bottom: 8px;
}

.series-list-item {
  margin-bottom: 24px;
}

.avatar-wrapper {
  width: 36px;
  height: 36px;
}

.avatar-wrapper > img {
  width: 100%;
  height: 100%;
  border-radius: 18px;
}

.list-item-text {
font-family: 'IBM Plex Mono';
font-style: normal;
}

.text-subtitle {
  height: 21px;
  font-weight: bold;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.1px;
  color: #000000;
  margin-bottom: 1px;
}

.text-caption {
  height: 18px;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: #000000;
}

.quote {
  display: flex;
  flex-direction: column;
  width: 325px;
  max-height: 190px;
}

.text-body {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #000000;
  margin-bottom: 16px;
}

.motive-logo-wrapper {
  width: 105px;
  height: calc(25px * 105/85);
  right: 8px;
  bottom: 8px;
}

.motive-logo {
  width: 100%;
  height: 100%;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.max-height-32 {
  max-height: 128px;
}

.max-height-16 {
  max-height: 64px;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.ml-2 {
  margin-left: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.justify-between {
  justify-content: space-between;
}
</style>