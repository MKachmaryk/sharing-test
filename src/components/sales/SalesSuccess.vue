<template>
  <div class="sales-success">
    <div class="success-body flex-col text-black">
      <div class="h3 mb-xl text-center">{{ headerText }}</div>
      <div class="h5 mb-xs text-align">WHAT NOW?</div>
      <div class="mb-md text-align">
        We’ve sent you an email with a download link and more info about the project. To continue showing the love, you can share this news.
        <br />
        <br />
        As a {{ this.project.name }} participant, we keep you posted on the health and progress of the project- and on the impact coming from your investment overall.
      </div>
      <div class="big-grid">
        <div class="flex justify-center items-center">
          <ImageContainer class="ss-image-width" square :src="bundle.imageUrl" />
        </div>
        <div class="small-grid">
          <div class="flex justify-center">
            <ActionButton
              bg-color="green-light"
              icon="format-quote-open-outline"
              text="View in Library"
              @click="goToLibrary"
            />
          </div>
          <div class="flex justify-center">
            <ActionButton
              bg-color="purple-light"
              icon="help"
              text="Ask a Question"
              @click="goToAskTool"
            />
          </div>
          <div class="flex justify-center">
            <ActionButton
              bg-color="gray-300"
              icon="folder-download"
              text="Download Files"
              @click="downloadBundle"
            />
          </div>
          <div class="flex justify-center">
            <ActionButton
              bg-color="blue-light"
              icon="share"
              text="Share it online"
              @click="goToShareTool"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionButton from '@/components/buttons/ActionButton.vue';
import ImageContainer from '@/components/items/ImageContainer.vue';

import { mapState } from 'vuex';

export default {
  name: 'SalesSuccess',
  components: {
    ActionButton,
    ImageContainer
  },
  props: {
    bundle: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['user', 'windowWidth']),
    project() {
      return this.bundle.project;
    },
    headerImage() {
      return this.bundle.imageUrl;
    },
    headerText() {
      // TO-DO: SWITCH ID TO NAME
      const { name, ensemble, series } = this.project;
      return `You’re now a member of “${name}” a project by ${ensemble.name} and ${series.name}.`;
    }
  },
  methods: {
    goToLibrary() {
      this.$router.push({ name: 'purchases' });
      this.$emit('deactivate-app-nav');
    },
    goToAskTool() {
      console.log('testing ');
      this.$router.push({
        name: 'unit-page',
        params: { unitId: this.bundle.units[0].id },
        query: { action: 'ask' }
      });
    },
    goToShareTool() {
      this.$router.push({
        name: 'unit-page',
        params: { unitId: this.bundle.units[0].id },
        query: { action: 'share' }
      });
    },
    downloadBundle() {
      console.log('downloading...');
      const link = document.createElement('a');
      const downloadUrl = this.bundle.download_url;
      if (downloadUrl !== null) {
        link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        return;
      }
      console.log('there is no download url for this bundle');
    }
  }
};
</script>

<style lang="scss" scoped>
.sales-success {
  position: relative;
  width: 100%;
  max-width: 1024px;
  flex-shrink: 0;
  margin: 0 auto;
  overflow-x: hidden;
  padding-bottom: 10px;
}

.success-body {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding-top: 215px;
  padding: 40px 12px 0px;
  @include for-size(medium-screen-up) {
    padding: 100px 0px 0px;
  }
}

.text-align {
  text-align: left;
  @include for-size(medium-screen-up) {
    text-align: center;
  }
}

.ss-image-width {
  width: 100%;
  max-width: 512px;
  margin-bottom: 54px;
  @include for-size(tablet-portrait-up) {
    margin-bottom: 0px;
  }
}

.big-grid {
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-columns: 100%;
  @include for-size(tablet-portrait-up) {
    grid-template-rows: 100%;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-column-gap: 20px;
  }
}

.small-grid {
  grid-row: 2;
  grid-column: 1;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  @include for-size(tablet-portrait-up) {
    grid-row: 1;
    grid-column: 2;
  }
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 1px);
  object-fit: cover;
  object-position: center center;
}
</style>