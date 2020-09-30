<template>
  <div v-if="unit || profile" id="asset-view" class="w-screen h-full">
    <div class="w-full h-full max-w-screen-xl mx-auto relative">
      <slot :lower-tray-state="lowerTrayState"></slot>
      <Toolbelt
        :class="lowerTrayHeight"
        :lower-state="lowerTrayState"
        @toggle-share-tool="onToggleShareTool"
      />
      <div :class="['lower-tray', lowerTrayHeight]">
        <QaModule :lower-tray-state="lowerTrayState" />
      </div>

      <div v-if="sharing" class="share-tool-container">
        <ShareCard :item="item" />
        <div class="flex w-full justify-center stc-buttons">
          <Button
            bg-color="facebook"
            class="mr-4"
            color="white"
            icon="facebook"
            round
            @click="handleShareToFacebook"
          />
          <Button
            bg-color="twitter"
            class="mr-4"
            color="white"
            icon="twitter"
            round
            @click="handleShareToTwitter"
          />
        </div>
      </div>
      <div v-if="sharing" class="stc-triangle"></div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import ShareCard from '@/components/items/ShareCard.vue';
import Toolbelt from '@/components/tools/Toolbelt.vue';
import QaModule from '@/components/qa/QaModule.vue';
import VueMeta from 'vue-meta';
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'MatrixContainer',

  metaInfo () {
    return {
      meta: this.meta
    }
  },

  mounted () {
    this.updateSocialMetaTags();
  },

  /* COMPONENTS */
  components: {
    Button,
    ShareCard,
    Toolbelt,
    QaModule
  },

  /* DATA */
  data() {
    return {
      lowerTrayState: 'preview',
      sharing: false,
      shareUrl: null,
      imageUrl: '',
      meta: []
    };
  },

  /* COMPUTED */
  computed: {
    ...mapState(['profile', 'qa', 'unit', 'user']),

    lowerTrayHeight() {
      return `lower-tray-height--${this.lowerTrayState}`;
    },
    item() {
      const item = this.$route.name === 'asset' ? this.unit : this.profile;
      const { name, description, image_url, project } = item;
      return {
        name,
        description,
        image_url,
        ensemble: project.ensemble,
        series: project.series,
        type: this.$route.name,
        quote: project.ensemble.qa_who_we_are || 'This is a default quote.',
      }
    },
    descriptionClass() {
      return this.item.type === 'entity' ? 'text-body w-full max-height-16 mb-4' : 'hidden';
    },
    ensembleListItemClass() {
      return this.item.type === 'asset' ? 'ensemble-list-item flex' : 'hidden';
    },
    seriesListItemClass() {
      return this.item.type === 'asset' ? 'series-list-item flex' : 'hidden';
    },

    html() {
      return `
        <div class="share-card-container">
          <div class="section--image">
            <div class="card-image-wrapper">
              <img src="${this.item.image_url}" />
            </div>
          </div>
          <div class="section--text">
            <div class="section--text__title flex">
              <div class="text-h5">
                ${this.item.name}
              </div>
            </div>
            <div class="descriptionClass">
              ${this.item.description}
            </div>
            <div class="${this.ensembleListItemClass}">
              <div class="avatar-wrapper">
                <img src="${this.item.ensemble.image_url}" />
              </div>
              <div class="list-item-text flex flex-col justify-between ml-2">
                <div class="text-subtitle">
                  ${this.item.ensemble.name}
                </div>
                <div class="text-caption">
                  ENSEMBLE
                </div>
              </div>
            </div>
            <div :class="seriesListItemClass">
              <div class="avatar-wrapper">
                <img src="${this.item.series.image_url}" />
              </div>
              <div class="list-item-text flex flex-col justify-between ml-2">
                <div class="text-subtitle">
                  ${this.item.series.name}
                </div>
                <div class="text-caption">
                  SERIES
                </div>
              </div>
            </div>
            <div class="quote w-full">
              <div class="text-body w-full max-height-32 mb-4 ellipsis overflow-hidden">
                ${this.item.quote}
              </div>
              <div class="member-list-item flex">
                <div class="avatar-wrapper">
                  <img src="${this.item.ensemble.members[0].image_url}" />
                </div>
                <div class="list-item-text flex flex-col justify-between ml-2">
                  <div class="text-subtitle">
                    ${this.item.ensemble.members[0].name}
                  </div>
                  <div class="text-caption">
                    Member, ${this.item.ensemble.name}
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
      `;
    },

    css() {
      return `
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
      `;
    }
  },

  /* WATCHERS */
  watch: {
    $route: 'fetchData',
    '$route.query.from': 'activateQa'
  },

  /* HOOKS */
  created() {
    this.fetchData();
    this.$eventBus.$on('toggle-lower-tray-state', this.activatelowerTrayState);
    document.addEventListener('keyup', this.handleKeyUpEvent);
    this.initFacebookSDK();
  },

  beforeDestroy() {
    this.onBeforeDestroy();
  },

  /* METHODS */
  methods: {
    updateSocialMetaTags () {
      this.meta = [
        // Twitter Card
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:url',
          content: 'https://loftie.com'
        },
        {
          name: 'twitter:title',
          content: 'Vue Social Cards Example'
        },
        {
          name: 'twitter:description',
          content: 'Vue sample site showing off Twitter and Facebook Cards.'
        },
        {
          name: 'twitter:image',
          content: 'http://dev.to/social_previews/user/139093.png'
        },
        // Facebook OpenGraph
        {
          property: 'og:url',
          content: 'http://www.nytimes.com/2015/02/19/arts/international/when-great-minds-dont-think-alike.html'
        },
        {
          property: 'og:type',
          content: 'article'
        },
        {
          property: 'og:title',
          content: 'When Great Minds Don’t Think Alike'
        },
        {
          property: 'og:description',
          content: 'How much does culture influence creative thinking?'
        },
        {
          property: 'og:image',
          content: 'http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg'
        }
      ]
    },

    async fetchData() {
      if (this.$route.name === 'asset') {
        await this.fetchAssetData();
      } else if (this.$route.name === 'profile') {
        await this.fetchProfileData();
      }
      if (this.$route.query.from === 'ask') {
        console.log({ q: this.$route.query });
        this.lowerTrayState = 'active';
      }

      if (this.$route.query.from === 'play') {
        this.$eventBus.$emit('handle-external-play');
      }
    },

    async mountAssetMetaTags() {
      // STUB: MOUNT THE CUSTOM VUE META TAGS FOR SHARE CARD ON AN ASSET PAGE
    },

    async mountProfileMetaTags() {
      // STUB: MOUNT THE CUSTOM VUE META TAGS FOR SHARE CARD ON A PROFILE PAGE
    },

    fetchAssetData() {
      const id = this.$route.params.id;
      this.$store.dispatch('loadAsset', { id }).then(() => {
        this.$store.dispatch('loadQa', {
          entityId: this.unit.entity_id,
          entityType: 'asset'
        });
        this.fetchRelatedQaData('asset');
        this.$store.commit('setProfile', { profile: null });
      })
      .then(async () => {
        await this.mountAssetMetaTags();
      })
    },
    async fetchRelatedQaData(entityType) {
      if (entityType === 'asset') {
        const { ensemble, series } = this.unit.project;
        const ensemblePayload = {
          entityType: 'ensemble',
          entityId: ensemble.entity_id
        };
        const seriesPayload = {
          entityType: 'series',
          entityId: series.entity_id
        };
        await Promise.all([
          this.$store.dispatch('loadQa', ensemblePayload),
          this.$store.dispatch('loadQa', seriesPayload)
        ]);
      } else if (entityType === 'profile') {
        const { ensemble, series } = this.project;
        const ensemblePayload = {
          entityType: 'ensemble',
          entityId: ensemble.entity_id
        };
        const seriesPayload = {
          entityType: 'series',
          entityId: series.entity_id
        };
        await Promise.all([
          this.$store.dispatch('loadQa', ensemblePayload),
          this.$store.dispatch('loadQa', seriesPayload)
        ]);
      }
    },

    fetchProfileData() {
      this.$store.dispatch('loadProfile', this.$route.params).then(() => {
        this.$store.dispatch('loadQa', {
          entityId: this.profile.entity_id,
          entityType: 'profile'
        });
        this.$store.commit('setUnit', { unit: null });
      });
    },

    handleKeyUpEvent({ code }) {
      if (
        code === 'Space' &&
        !this.$store.state.editing &&
        this.lowerTrayState !== 'active'
      ) {
        this.$eventBus.$emit('handle-external-play');
      } else if (code === 'Escape' && this.lowerTrayState === 'active') {
        this.activatelowerTrayState('preview');
      }
    },

    pause(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    activatelowerTrayState(newState) {
      this.lowerTrayState = newState;
    },

    onToggleShareTool(newState) {
      this.sharing = !this.sharing;
    },

    onBeforeDestroy() {
      this.$eventBus.$off('toggle-lower-tray-state');
      this.$eventBus.$off('toggle-tool');
      this.$store.commit('setUnit', { unit: null });
      this.$store.commit('setQa', { qa: {} });
      this.$store.commit('setProfile', { profile: null });
      document.removeEventListener('keyup', this.handleKeyUpEvent);
    },

    async handleGenerateImage() {
      const data = {
        html: this.html,
        css: this.css,
        google_fonts: "Space Mono"
      };

      const auth = {
        username: 'cb68ef02-fc79-4be0-b294-27c68ed04daf',
        password: '0e062308-5470-4901-823c-28da89902316',
      };

      try {
      const response = await axios({
        method: 'post',
        url: 'https://hcti.io/v1/image',
        data,
        auth
      })
      console.log({ response })

      this.shareUrl = response.data.url;
      return response.data.url;
      } catch (err) {
        console.log(err);
      }
    },

    async handleShareToFacebook() {
      // const imageUrl = await this.handleGenerateImage();
      // eslint-disable-next-line no-undef
      // this.$nextTick(() => {
      //   FB.ui({
      //     method: 'share',
      //     href: imageUrl,
      //   }, function (response) {
      //     console.log(response)
      //   })
      // })
      // eslint-disable-next-line no-undef
      FB.ui({
        method: 'share',
        href: window.location.href
      }, function (response) {
        console.log(response)
      })
      // STUB: Share to Facebook
      // Use this.handleGenerateImage method above to generate the image that will be shared on the Facebook card
    },

    async handleShareToTwitter() {
      // STUB: Share to Twitter
      // Use this.handleGenerateImage method above to generate the image that will be shared on the Twitter card
      // this.imageUrl = await this.handleGenerateImage();
      window.open(`https://twitter.com/intent/tweet?url=${encodeURI(window.location.href)}`, '_blank');
    },

    initFacebookSDK () {
      window.fbAsyncInit = function () {
        // eslint-disable-next-line no-undef
        FB.init({
          appId: '338925173989927',
          version: 'v2.9'
        })
      };

      (function (d, s, id) {
        const fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) { return }
        const js = d.createElement(s)
        js.id = id
        js.src = '//connect.facebook.net/en_US/sdk.js'
        fjs.parentNode.insertBefore(js, fjs)
      }(document, 'script', 'facebook-jssdk'))
    }
  }
};
</script>

<style lang="scss" scoped>
/*
 * Tools
 */

#toolbelt {
  position: absolute;
  margin: 0px 0 0 0;
  width: 100%;
  width: inherit;
  z-index: 3;
  bottom: auto;
  transition: bottom 300ms ease;
  &.lower-tray-height--active {
    bottom: calc(var(--vh, 1vh) * 100 - 181px);
    // transition: bottom 500ms ease;
  }
  &.lower-tray-height--summary,
  &.lower-tray-height--react {
    bottom: 255px;
  }
  &.lower-tray-height--preview {
    bottom: 60px;
  }
  &.lower-tray-height--purchase {
    bottom: 112px;
  }
  &.lower-tray-height--share {
    bottom: 168px;
  }
}

.lower-tray {
  z-index: 2;
  display: flex;
  justify-content: center;
  overflow-x: scroll;
  overflow-y: hidden;
  position: absolute;
  bottom: -1px;
  width: inherit;
  height: inherit;
  transition: height 300ms ease;
  &.lower-tray-height--active {
    height: calc(var(--vh, 1vh) * 100 - 180px);
    > div {
      height: calc(var(--vh, 1vh) * 100 - 180px);
    }
  }
  &.lower-tray-height--summary,
  &.lower-tray-height--react {
    height: 255px;
    > div {
      height: 255px;
    }
  }
  &.lower-tray-height--preview {
    height: 60px;
    > div {
      height: 60px;
      min-height: 60px;
    }
  }
  &.lower-tray-height--purchase {
    height: 112px;
    > div {
      height: 112px;
      min-height: 112px;
    }
  }
  &.lower-tray-height--share {
    height: 168px;
    > div {
      height: 168px;
      min-height: 168px;
    }
  }
}

.share-tool-container {
  position: absolute;
  bottom: 147.7px;
  right: 16px;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  width: 462px;
  height: 316px;
  border-radius: 12px;
  background-color: gray;
  > .share-card-container {
    transform: translate(-25%, -24px) scale(0.5) !important;
    transform-origin: center center;
  }
}

.stc-triangle {
  position: absolute;
  bottom: 120px;
  right: 64px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 27.7px 16px 0 16px;
  border-color: gray transparent transparent transparent;
}

.stc-buttons {
  position: absolute;
  bottom: 16px;
  left: 16px;
}
</style>

<style lang="scss">
::-webkit-scrollbar {
  width: 17px;
  background-color: transparent;
  display: none;
}
</style>
