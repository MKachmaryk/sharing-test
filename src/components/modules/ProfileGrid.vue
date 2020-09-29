<template>
  <div
    id="profile-grid"
    ref="asset-grid"
    class="upper-grid flex flex-col items-center w-screen max-w-screen-xl mx-auto"
    @click="handleContainerClick"
  >
    <!-- Header image & text -->
    <!-- <ImageContainer class="w-full h-48 sm:h-64 mb-md sm:mb-xxl" :src="profile.image_url" /> -->
    <div class="h1 mt-xl mb-xl text-center">{{ profile.name }}</div>

    <!-- Who am i & Who i work with-->
    <div class="relative w-full min-h-64 px-4 mb-xxl">
      <div class="min-h-40 w-full max-w-screen-xl flex flex-wrap justify-between bg-white p-3">
        <div class="relative w-full sm:w-1/2">
          <div class="h6 mb-sm">WHO AM I</div>
          <div class="mb-lg sm:mb-0 sm:pr-32">{{ profile.description || profile.bio || '' }}</div>
          <Button
            v-if="hasAdminPermissions"
            bg-color="dark-100"
            color="black"
            class="mt-sm"
            icon="cog"
            @click="showDescriptionEditor = true"
          />
          <TextEditorCard
            v-if="showDescriptionEditor"
            bg-color="white"
            class="absolute inset-0"
            :erred="editorError"
            :succeeded="editorSuccess"
            field="bio"
            :value="updatedDescription"
            @close="onEditorClose"
            @input="updatedDescription = $event"
            @save="onEditorSave"
          />
        </div>
        <Avatar
          id="profile-avatar"
          class="mx-auto mb-lg sm:mb-0 sm:absolute cursor-default"
          :src="profile.image_url"
          size="4xl"
        />
        <div v-if="profile.collaborators && profile.collaborators.length" class="w-full sm:w-1/2">
          <div class="h6 mb-sm text-right">WHO I WORK WITH</div>
          <div class="flex reverse-row flex-wrap justify-end sm:pl-32">
            <Avatar
              v-for="c in profile.collaborators"
              :key="`collaborator-${c.entity_id}`"
              class="ml-lg mb-sm"
              :tertiary-text="c.name"
              text-size="text-xs"
              :src="c.image_url"
              size="md"
              @click="goToProfilePage(c.type, c.entity_id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- First quote module -->
    <QuoteModule
      v-if="profile.qa_who_we_are || profile.qa_what_i_do"
      class="mb-xxl sm:px-4"
      :editable="hasAdminPermissions"
      :quote-text="profile.qa_who_we_are || profile.qa_what_i_do"
      :quote-type="profile.type === 'user' ? 'qa_what_i_do' : 'qa_who_we_are'"
      :quote-author="quoteModuleAuthor"
      :buttons="firstQuoteModuleButtonProps"
      @left-button-click="onActionButtonContractClick"
      @right-button-click="onActionButtonQuestionClick"
    />

    <!-- CURRENTLY SPOTLIGHTING -->
    <div v-if="spotlight" class="w-full flex flex-col items-center">
      <div class="h5 mb-lg text-center">CURRENTLY SPOTLIGHTING</div>
      <div class="h2 mb-xl text-center">{{ spotlight.name.toUpperCase() }}</div>
      <div class="flex flex-col sm:flex-row justify-center mb-lg">
        <div
          class="cursor-default bg-white inline-flex justify-center items-center"
          style="height: 38px; padding: 10px 20px;"
        >{{ spotlight.name.toUpperCase() }}</div>
        <Button
          bg-color="blue-light"
          :text="playerIsPlaying ? 'PAUSE' : 'PLAY'"
          @click="$eventBus.$emit('handle-external-play')"
        />
      </div>
      <div class="flex flex-col sm:flex-row sm:justify-center items-center px-4 mb-xxxl w-full max-w-screen-lg">
        <div class="asset-module w-full h-full sm:mb-0">
          <ImageContainer class="mb-sm" :src="spotlight.image_url" square />
          <div class="footnote text-center">
            <span>{{ spotlight.name }}</span>
            <!-- <span v-if="parentPlaylist">
              &nbsp;&#183;&nbsp;part of
              <span
                class="cursor-pointer text-blue-500"
                @click="$router.push({ name: 'asset', params: { id: parentPlaylist.id } })"
              >{{ parentPlaylist.name }}</span>
            </span>-->
            <span>
              &nbsp;&#183;&nbsp;{{ metadata }}&nbsp;&#183;&nbsp;{{
              releaseDate
              }}
            </span>
          </div>
        </div>
        <div
          class="asset-module relative w-full sm:h-full sm:overflow-y-scroll"
        >
          <AssetPlayer
            v-if="hasPlayer"
            class="w-full"
            :class="{ 'opacity-25': paywalled, 'pointer-events-none': paywalled }"
            style="height: 99%;"
            :duration="duration"
            :spotlight="spotlight"
          />
          <div
            v-if="paywalled"
            class="absolute top-0 left-0 asset-module w-full sm:h-full p-4 flex justify-center items-center"
            style="z-index: 2;"
          >
            <div class="p-4 h3 bg-white shadow flex flex-col items-center justify-center">
              <div class="h3 mb-4">
                Subscribe to {{ project.name }} for access
              </div>
              <Button
                text="SUPPORT THE CREATORS"
                bg-color="green-light"
                @click="goToSalesPage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Other units associated with this profile -->
    <div
      v-if="profile.units && profile.units.filter(o => o.id !== spotlight.id && o.type !== 'stream').length"
      class="h5 mt-xxxl mb-md text-center"
    >{{ profile.type === 'user' ? 'MY' : 'OUR' }} LATEST & GREATEST</div>
    <carousel
      class="w-full px-4 mb-md"
      :perPageCustom="[[250, 1], [640, 2], [900, 3]]"
      paginationColor="lightgrey"
    >
      <template v-for="item in profile.units.filter(o => o.id !== spotlight.id && o.type !== 'stream')" >
        <slide :key="item.id">
          <PreviewCard
            class="related-cards"
            :ensemble="item.project.ensemble"
            :project-image-url="item.project.image_url"
            :project-name="item.project.name"
            :series="item.project.series"
            :unit="item"
          />
        </slide>
      </template>
    </carousel>
    <!-- <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-4 mb-10">
      <AssetCard
        v-for="item in profile.units"
        :key="`item-${item.id}`"
        class="mx-auto"
        :asset-id="item.id"
        :image="item.image_url"
        :project="item.project"
        :name="item.name"
        :release-date="item.releaseDate"
        :type="item.type"
        :metadata="item.type === 'playlist' ? item.children : item.file"
      />
    </div> -->
  </div>
</template>

<script>
import AssetPlayer from '@/components/asset/AssetPlayer';
import Avatar from '@/components/items/Avatar.vue';
import Button from '@/components/buttons/Button.vue';
import ImageContainer from '@/components/items/ImageContainer.vue';
import PreviewCard from '@/components/items/PreviewCard.vue';
import QuoteModule from '@/components/modules/QuoteModule.vue';
import TextEditorCard from '@/components/inputs/TextEditorCard.vue';

import { Carousel, Slide } from 'vue-carousel';
import { mapState } from 'vuex';

export default {
  name: 'ProfileGrid',
  components: {
    AssetPlayer,
    Avatar,
    Button,
    ImageContainer,
    PreviewCard,
    QuoteModule,
    TextEditorCard,
    Carousel,
    Slide
  },
  props: {
    lowerState: String
  },
  data() {
    return {
      showDescriptionEditor: false,
      editorError: false,
      editorSuccess: false,
      updatedDescription: '',
      firstQuoteModuleButtonProps: [
        {
          bgColor: 'yellow-light',
          icon: 'format-quote-open-outline',
          text: "See what we've said"
        },
        { bgColor: 'purple-light', icon: 'help', text: 'Ask a question' }
      ]
    };
  },
  computed: {
    ...mapState(['playerIsPlaying', 'profile', 'user']),
    paywalled() {
      return !this.userIsSubscriber || !this.spotlight.is_promotional;
    },
    userIsSubscriber() {
      try {
        const projectIds = this.user.purchased.map(p => p.bundle.project.id);
        return projectIds.includes(this.project.id);
      } catch (err) {
        return null;
      }
    },
    hasAdminPermissions() {
      const adminIds = [41, 57, 141];
      return (
        this.$store.state.user.entity_id === this.profile.entity_id ||
        adminIds.includes(this.$store.state.user.id)
      );
    },
    quoteModuleAuthor() {
      const { id, entity_id, name, image_url, type } = this.profile;
      return { id, entity_id, name, image_url, type };
    },
    spotlight() {
      if (!this.profile.units || !this.profile.units.length) return null;
      return this.profile.units[0];
    },
    project() {
      return this.spotlight.project;
    },
    hasPlayer() {
      const types = ['audio', 'playlist', 'video'];
      return types.includes(this.spotlight.type);
    },
    releaseDate() {
      return this.$moment(this.spotlight.releaseDate).format('MMMM D, YYYY');
    },
    duration() {
      function formatDuration(secs) {
        const date = new Date(null);
        date.setSeconds(secs);
        let duration = date.toISOString().substr(11, 8);
        if (duration.split(':')[0] === '00') {
          duration = duration
            .split(':')
            .slice(1)
            .join(':');
        }
        return duration;
      }
      try {
        if (this.spotlight.type === 'playlist') {
          const tracks = this.spotlight.project.bundles[0].units[0].children;
          const duration = tracks.reduce(
            (a, b) => a + b.file.audio.duration,
            0
          );
          return formatDuration(duration);
        } else {
          return formatDuration(
            this.spotlight.file[this.spotlight.type].duration
          );
        }
      } catch (err) {
        console.log(err);
        return '';
      }
    },
    metadata() {
      if (!this.spotlight) return null;
      try {
        if (this.spotlight.type === 'playlist') {
          const tracks = this.spotlight.project.bundles[0].units[0].children;
          return `${tracks.length} tracks, ${this.duration}`;
        } else {
          return `${this.spotlight.file.type}, ${this.duration}`;
        }
      } catch (err) {
        console.log(err);
        return '';
      }
    }
  },
  watch: {
    'profile.id': 'scrollToTop'
  },
  mounted() {
    this.$store.dispatch('user/loadPurchased', true);
    this.updatedDescription =
      this.profile.description || this.profile.bio || '';
  },
  methods: {
    scrollToTop() {
      this.$refs['asset-grid'].scrollTop = 0;
    },
    handleContainerClick() {
      if (this.lowerState === 'active' || this.lowerState === 'share') {
        this.$eventBus.$emit('toggle-lower-tray-state', 'preview');
      }
    },
    goToProfilePage(entityType, entityId) {
      this.$router.push({
        name: 'profile',
        params: { entityType, entityId }
      });
    },
    onActionButtonContractClick() {
      return;
    },
    onActionButtonQuestionClick() {
      console.log('toggling qa tray');
      this.$eventBus.$emit('toggle-lower-tray-state', 'active');
    },
    goToSalesPage() {
      this.$router.push({
        name: 'sales-page',
        params: { projectId: this.spotlight.project.id }
      });
    },
    onEditorClose() {
      this.showDescriptionEditor = false;
      this.updatedDescription =
        this.profile.description || this.profile.bio || '';
    },
    async onEditorSave() {
      const { entityId, entityType } = this.$route.params;
      const updateKey = entityType === 'user' ? 'bio' : 'description';
      try {
        const url = `/${entityType}?entity_id=eq.${entityId}`;
        const update = { [updateKey]: this.updatedDescription };
        await this.$pg.patch(url, update);
        this.editorSuccess = true;
        await this.setPause(1000);
        this.$store.dispatch('loadProfile', this.$route.params).then(() => {
          this.showDescriptionEditor = false;
          this.editorError = false;
          this.editorSuccess = false;
        });
      } catch (err) {
        // eslint-disable-next-line
        console.log({ err });
        this.editorError = true;
        setTimeout(() => (this.editorError = false), 3000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#profile-avatar {
  top: calc(50% - 256px / 2);
  left: calc(50% - 256px / 2);
}

.asset-module {
  width: 100%;
  height: auto;
  @include min-width(640) {
    width: 320px;
    height: 360px;
  }
  @include min-width(800) {
    width: 400px;
    height: 440px;
  }
  @include min-width(900) {
    width: 450px;
    height: 490px;
  }
  @include min-width(1024) {
    width: 512px;
    height: 552px;
  }
}

.related-cards {
  min-width: 250px;
  width: calc(100vw - 40px) !important;
  margin: 0 auto;
  @include min-width(640) {
    min-width: 300px !important;
    width: calc(50vw - 40px) !important;
  }
  @include min-width(900) {
    width: calc(33vw - 40px) !important;
    max-width: 350px !important; 
  }
}

.VueCarousel-wrapper {
  height: 460px !important;
}

.VueCarousel-pagination {
  height: 34px !important;
}
</style>
