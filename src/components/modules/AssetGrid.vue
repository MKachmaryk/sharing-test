<template>
  <div
    v-if="unit && user.purchased"
    id="asset-grid"
    ref="asset-grid"
    class="upper-grid flex flex-col items-center w-screen max-w-screen-xl mx-auto"
    @click="handleContainerClick"
  >
    <!-- Header image & text -->
    <!-- <ImageContainer class="w-full h-48 sm:h-64 mb-md sm:mb-xxl" :src="unit.image_url" /> -->
    <div class="h1 mt-xl mb-xl text-center">{{ unit.name }}</div>

    <!-- Ensemble & series cards -->
    <div class="flex-col sm:flex-row flex justify-center mb-xl w-full max-w-screen-lg">
      <div class="flex-col sm:items-end flex-shrink w-full sm:w-1/2 sm:items-end">
        <Card
          :header="project.ensemble.name"
          subheader="Made the work"
          :supporting-text="
            project.ensemble.description ||
              `This is the artist behind ${project.name}`
          "
          :image="project.ensemble.image_url"
          format="entity"
          @click="goToProfilePage('ensemble', project.ensemble.entity_id)"
        />
        <Button
          class="px-one"
          bg-color="transparent"
          :text="`MORE FROM ${project.ensemble.name.toUpperCase()}`"
          @click="goToProfilePage('ensemble', project.ensemble.entity_id)"
        />
      </div>
      <div class="flex-col sm:block flex-shrink w-full sm:w-1/2">
        <Card
          :header="project.series.name"
          subheader="Backed the project"
          :supporting-text="
            project.series.description ||
              `This is the artist behind ${project.name}`
          "
          :image="project.series.image_url"
          text-right
          format="entity"
          @click="goToProfilePage('series', project.series.entity_id)"
        />
        <Button
          class="px-one"
          bg-color="transparent"
          :text="`MORE FROM ${project.series.name.toUpperCase()}`"
          @click="goToProfilePage('series', project.series.entity_id)"
        />
      </div>
    </div>

    <!-- First quote module -->
    <QuoteModule
      class="mb-xl sm:px-4"
      :quote-text="project.ensemble.qa_who_we_are"
      :quote-author="project.ensemble"
      :buttons="firstQuoteModuleButtonProps"
      @left-button-click="onActionButtonContractClick"
      @right-button-click="onActionButtonQuestionClick"
    />

    <!-- Asset module -->
    <div class="flex flex-col sm:flex-row justify-center mb-md">
      <div
        class="cursor-default bg-white inline-flex justify-center items-center"
        style="height: 38px; padding: 10px 20px;"
      >{{ unit.name.toUpperCase() }}</div>
      <Button
        bg-color="blue-light"
        :text="playerIsPlaying ? 'PAUSE' : 'PLAY'"
        @click="$eventBus.$emit('handle-external-play')"
      />
    </div>
    <div class="flex flex-col sm:flex-row justify-center px-4 lg:px-0 mb-xl w-full max-w-screen-lg" :class="{ 'flex-wrap': !!streamUrl }">
      <div v-if="!streamUrl" class="asset-module w-full h-full sm:mb-0" :class="{ 'asset-module--stream': !!streamUrl }">
        <ImageContainer class="mb-sm" :src="streamUrl ? project.image_url : unit.image_url" square />
        <div class="flex flex-col footnote text-center">
          <div>{{ unit.name }}</div>
          <div>
            <span v-if="parentPlaylist">
              part of
              <span
                class="cursor-pointer text-blue-500"
                @click="$router.push({ name: 'asset', params: { id: parentPlaylist.id } })"
              >{{ parentPlaylist.name }}&nbsp;&#183;&nbsp;</span>
            </span>
            <span>
              {{ metadata }}&nbsp;&#183;&nbsp;{{
              releaseDate
              }}
            </span>
          </div>
        </div>
      </div>
      <div
        class="asset-module relative w-full sm:h-full sm:overflow-y-scroll"
        :class="{ 'asset-module--stream': !!streamUrl }"
      >
        <VideoPlayer
          v-if="streamUrl"
          :class="{ 'opacity-25': paywalled && unit.type !== 'stream', 'pointer-events-none': paywalled && unit.type !== 'stream' }"
          :poster="project.image_url"
          :source-url="streamUrl"
          :wowza="unit.metadata.wowza_live_stream"
        />
        <AssetPlayer
          v-else-if="hasPlayer"
          class="w-full"
          :class="{ 'opacity-25': paywalled && unit.type !== 'stream', 'pointer-events-none': paywalled && unit.type !== 'stream' }"
          :duration="duration"
          style="height: 99%;"
          :unit-id="unit.id"
        />
        <div
          v-if="paywalled && unit.type !== 'stream'"
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

    <!-- Credits -->
    <div class="flex flex-col sm:flex-row justify-center px-4 mb-xl w-full max-w-screen-lg">
      <div class="w-full sm:w-1/2">
        <div class="h5 mb-sm text-center">MEET THE ARTISTS ({{ ensembleMembers.length }})</div>
        <list-group
          class="flex overflow-x-scroll px-4"
          :class="ensembleMembers.length > 5 ? 'justify-start' : 'justify-center'"
        >
          <Avatar
            v-for="member in ensembleMembers"
            :key="`ensemble-member-${member.entity_id}-${member.label}`"
            :src="member.image_url"
            size="lg"
            style="flex: 0 1 auto; margin: 10px;"
            :header="member.name"
            :subheader="member.label.join(', ')"
            @click="goToProfilePage('user', member.entity_id)"
          />
        </list-group>
      </div>
      <div class="w-full sm:w-1/2">
        <div class="h5 mb-sm text-center">MEET THE SERIES ({{ seriesStaff.length }})</div>
        <list-group
          class="flex overflow-x-scroll"
          :class="seriesStaff.length > 5 ? 'justify-start' : 'justify-center'"
        >
          <Avatar
            v-for="member in seriesStaff"
            :key="`series-member-${member.entity_id}`"
            :src="member.image_url"
            size="lg"
            style="flex: 0 1 auto; margin: 10px; "
            :header="member.name"
            :subheader="member.label.join(', ')"
            @click="goToProfilePage('user', member.entity_id)"
          />
        </list-group>
      </div>
    </div>

    <!-- Project financial metrics & support CTA -->
    <div class="h5 mb-sm text-center">WE STARTED A PROJECT TOGETHER</div>
    <div class="mb-xl text-center max-w-screen-md px-4 md:px-0">
      A project is a mission, it’s years of work, it’s the practice of an
      artist, the resources of an institution, and your support as a fan.
    </div>
    <div v-if="project.contract && project.bundles.length" class="flex justify-center flex-wrap sm:flex-no-wrap mb-xl w-full max-w-screen-md">
      <ProfitShare
        :ensemble-name="project.ensemble.name"
        :ensemble-share="project.contract.artistShare"
        :series-name="project.series.name"
      />
      <SupportModule
        class="h-full"
        :button-text="copy.support_btn_text"
        :revenue="project.revenue"
        :budget="project.investment"
        :project-id="project.id"
        :ensemble="project.ensemble"
        :series="project.series"
        style="max-width: 420px;"
        @support="goToSalesPage"
      />
    </div>
    <div class="h5 mb-sm text-center">WHAT IS SUPPORT?</div>
    <div class="mb-xl text-center max-w-screen-md px-4 md:px-0">
      {{ copy.support_description }}
    </div>

    <!-- Thank you -->
    <div class="h5 mb-sm text-center">THANK YOU TO OUR SUPPORTERS</div>
    <div v-if="project.bundles.length" class="flex justify-around w-full max-w-screen-md">
      <Badge label="supporters" :quantity="supporters.length" />
      <Badge label="raised" :quantity="project.revenue / 100" currency />
    </div>
    <list-group v-if="project.bundles.length" class="flex flex-wrap sm-desktop:justify-center max-w-screen-lg mb-xl">
      <Card
        v-for="s in supporters"
        :key="`supporter-${s.entity_id}`"
        :header="s.name"
        :image="s.image_url"
        format="person"
        style="flex: 0 1 auto; margin: 10px;"
        text-right
        @click="goToProfilePage('user', s.entity_id)"
      />
    </list-group>

    <!-- Second quote module -->
    <div class="h5 mb-sm text-center">HEAR THE AUDIENCE</div>
    <QuoteModule
      class="mb-xl sm:px-4"
      :quote-text="project.ensemble.qa_mission_statement"
      :quote-author="project.ensemble"
      :buttons="secondQuoteModuleButtonProps"
      @left-button-click="onActionButtonQuestionClick"
      @right-button-click="onActionButtonQuestionClick"
    />

    <!-- Other units in the project -->
    <div v-if="project.units.filter(o => o.id !== unit.id && o.type !== 'stream').length" class="h5 mb-md text-center">MORE FROM {{ project.name }}</div>
    <carousel
      class="w-full px-4 mb-md"
      :perPageCustom="[[900, 3]]"
      paginationColor="lightgrey"
    >
      <template v-for="item in project.units.filter(o => o.id !== unit.id && o.type !== 'stream')" >
        <slide :key="item.id">
          <PreviewCard
            class="related-cards"
            :ensemble="project.ensemble"
            :project-image-url="project.image_url"
            :project-name="project.name"
            :series="project.series"
            :unit="item"
          />
        </slide>
      </template>
    </carousel>
  </div>
</template>

<script>
import AssetPlayer from '@/components/asset/AssetPlayer';
import Avatar from '@/components/items/Avatar.vue';
import Badge from '@/components/items/Badge.vue';
import Card from '@/components/items/Card.vue';
import ImageContainer from '@/components/items/ImageContainer.vue';
import ListGroup from '@/components/modules/ListGroup.vue';
import PreviewCard from '@/components/items/PreviewCard.vue';
import ProfitShare from '@/components/metrics/ProfitShare.vue';
import QuoteModule from '@/components/modules/QuoteModule.vue';
import SupportModule from '@/components/metrics/SupportModule.vue';
import Button from '@/components/buttons/Button.vue';
import VideoPlayer from '@/components/asset/VideoPlayer.vue';

import { Carousel, Slide } from 'vue-carousel';
import { mapState } from 'vuex';

export default {
  name: 'AssetGrid',
  components: {
    PreviewCard,
    AssetPlayer,
    Avatar,
    Badge,
    Card,
    ImageContainer,
    ListGroup,
    ProfitShare,
    QuoteModule,
    SupportModule,
    Button,
    VideoPlayer,
    Carousel,
    Slide
  },
  props: {
    lowerState: String
  },
  data() {
    return {
      firstQuoteModuleButtonProps: [
        {
          bgColor: 'dark-300',
          icon: 'file-document-outline',
          text: 'Check out our contract'
        },
        { bgColor: 'purple-light', icon: 'help', text: 'Ask a question' }
      ],
      secondQuoteModuleButtonProps: [
        {
          bgColor: 'yellow-light',
          icon: 'format-quote-open-outline',
          text: 'See what they said'
        },
        { bgColor: 'purple-light', icon: 'help', text: 'Join the conversation' }
      ],
      videoOptions: {
        autoplay: true,
        controls: true,
        height: '300px',
        poster: 'https://theloove.imgix.net/20200108023813--Charles%20Burnahm%202.jpg?w=900&auto=compress,enhance,format',
        preload: 'auto',
        src: 'https://cdn3.wowza.com/1/RVFFWE81NnNvaE5W/Z091NTVF/hls/live/playlist.m3u8',
        liveui: true,
      },
      streamUrl: null,
    };
  },
  computed: {
    ...mapState(['playerIsPlaying', 'unit', 'user', 'copy']),
    paywalled() {
      return !this.userIsSubscriber || !this.unit.is_promotional;
    },
    userIsSubscriber() {
      try {
        const projectIds = this.user.purchased.map(p => p.bundle.project.id);
        return projectIds.includes(this.project.id);
      } catch (err) {
        return null;
      }
    },
    ensembleMembers() {
      const { members } = this.project.ensemble;
      const result = this.$_.chain(members)
        .groupBy('name')
        .map(function(v, i) {
          return {
            name: i,
            image_url: _.get(_.find(v, 'image_url'), 'image_url'),
            entity_id: _.get(_.find(v, 'entity_id'), 'entity_id'),
            label: _.map(v, 'label')
          };
        })
        .value();
      return result;
    },
    seriesStaff() {
      const { members } = this.project.series;
      const result = this.$_.chain(members)
        .groupBy('name')
        .map(function(v, i) {
          return {
            name: i,
            image_url: _.get(_.find(v, 'image_url'), 'image_url'),
            entity_id: _.get(_.find(v, 'entity_id'), 'entity_id'),
            label: _.map(v, 'label')
          };
        })
        .value();
      return result;
    },
    project() {
      return this.unit.project;
    },
    unitCategory() {
      const image = ['image', 'video', 'stream'];

      return image.includes(this.unit.type) ? 'image' : 'music';
    },
    hasPlayer() {
      const types = ['audio', 'playlist', 'video'];
      return types.includes(this.unit.type);
    },
    releaseDate() {
      return this.$moment(this.unit.releaseDate).format('MMMM D, YYYY');
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
        if (this.unit.type === 'playlist') {
          if (!this.project.bundles.length) return formatDuration(300*12);
          const tracks = this.project.bundles[0].units[0].children;
          const duration = tracks.reduce(
            (a, b) => a + b.file.audio.duration,
            0
          );
          return formatDuration(duration);
        } else {
          return formatDuration(this.unit.file[this.unit.type].duration);
        }
      } catch (err) {
        console.log(err);
        return '';
      }
    },
    metadata() {
      try {
        if (this.unit.type === 'playlist') {
          if (!this.project.bundles.length) `12 tracks, ${this.duration}`;
          const tracks = this.project.bundles[0].units[0].children;
          return `${tracks.length} tracks, ${this.duration}`;
        } else if (this.unit.type === 'video') {
          return `${this.unit.file.type}, ${this.duration}`;
        } else {
          return '';
        }
      } catch (err) {
        console.log(err);
        return '';
      }
    },
    parentPlaylist() {
      if (this.unit.type !== 'audio') return '';
      return this.project.units.find(o => o.type === 'playlist');
    },
    supporters() {
      if (!this.project.bundles.length) return [];
      const supporters = this.project.bundles[0].sales.map(s => s.user);
      return this.$_.uniqBy(supporters, 'entity_id');
    }
  },
  watch: {
    'unit.id': 'scrollToTop'
  },
  mounted() {
    this.$store.dispatch('user/loadPurchased', true);
    if (this.unit.type === 'stream') {
      this.streamUrl = this.unit.metadata.wowza_live_stream.player_hls_playback_url;
    }
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
        params: { projectId: this.project.id }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.px-one {
  @apply px-1 #{!important};
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

.asset-module--stream {
    width: 100%;
    max-width: 800px;
    height: auto;
    margin-bottom: 8px;
}

.related-cards {
  width: 95% !important;
  margin: 0 auto;
}

.VueCarousel-wrapper {
  height: 460px !important;
}

.VueCarousel-pagination {
  height: 34px !important;
}
</style>
