<template>
  <table class="library-table table-fixed w-full caption">
    <thead>
      <tr class="text-left">
        <th class="always-visible px-4 py-2 w-1/3"></th>
        <th class="w-1/4 px-4 py-2">Artist</th>
        <th class="w-1/6 px-4 py-2">Series</th>
        <th class="w-1/6 px-4 py-2">Released</th>
        <th class="w-1/6 px-4 py-2">Time</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(track, i) in items"
        :key="`track-${i}-${track.id}`"
        class="border-b"
      >
        <td class="always-visible px-4 py-2">
          <div class="flex items-end">
            <Avatar
              class="flex-none mr-1"
              size="sm"
              square
              :src="track.image_url"
            />
            <TrackListItem
              class="cursor-pointer"
              :name="track.name"
              :duration-sec="track.audio.duration"
              :song-colors="track.audio.colors"
              @click="$router.push({ name: 'asset', params: { id: track.id } })"
            />
          </div>
        </td>
        <td class="px-4 py-2">{{ track.project.ensemble.name }}</td>
        <td class="px-4 py-2">{{ track.project.series.name }}</td>
        <td class=" px-4 py-2">
          {{ $moment(track.releaseDate).format('MM/DD/YY') }}
        </td>
        <td class="px-4 py-2">{{ formatDuration(track.audio.duration) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Avatar from '@/components/items/Avatar.vue';
import TrackListItem from '@/components/items/TrackListItem.vue';

  export default {
    name: 'LibraryTable',
    components: { Avatar, TrackListItem },
    props: {
      items: Array,
    }
  }
</script>

<style lang="scss" scoped>
th, td:not(.always-visible) {
  @include max-width(639) {
    display: none;
  }
}

.always-visible {
  @include min-width(639) {
    display: table-cell;
  }
}
</style>