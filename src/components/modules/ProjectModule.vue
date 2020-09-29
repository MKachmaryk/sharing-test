<template>
  <div class="project-module w-full">
    <!-- <div class="h1">PROJECT SPOTLIGHT</div>
    <div class="h2 mb-2">{{ project.name.toUpperCase() }}</div> -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div class="flex flex-col">
        <PreviewCard
          class="mx-auto mb-4"
          :ensemble="project.ensemble"
          :project-image-url="project.image_url"
          :project-name="project.name"
          :series="project.series"
          :unit="project.units[0]"
          style="height: 496px;"
        />
        <Button
          class="w-full mx-auto"
          text="PLAY"
          bg-color="blue-light mx-auto"
          style="max-width: 500px;"
          @click="
            $router.push({
              name: 'asset',
              params: { id: project.units[0].id },
              query: { from: 'play' }
            })
          "
        />
      </div>
      <div class="flex flex-col">
        <GroupCard
          class="flex-none mb-4"
          :group="project.ensemble"
          label="artist"
          type="ensemble"
        />
        <Button
          text="JOIN THE DISCUSSION"
          class="mx-auto w-full"
          bg-color="purple-light"
          style="max-width: 500px;"
          @click="
            $router.push({
              name: 'asset',
              params: { id: project.units[0].id },
              query: { from: 'ask' }
            })
          "
        />
      </div>
      <div class="flex flex-col sm:flex-row lg:flex-col">
        <GroupCard class="flex-none max-w-md mx-auto sm:mr-3 lg:mr-0 mb-4 md:mb-0 lg:mb-4" :group="project.series" label="series" type="series" :units="project.units" />
        <div class="flex flex-col flex-none w-full mx-auto md:h-60 lg:h-auto" style="max-width: 500px;">
          <SupportCard
            class="mx-auto mb-4 h-60 md:h-46 lg:h-60"
            :budget="project.budget"
            :bundle="project.bundles[0]"
            :ensemble-name="project.ensemble.name"
            :series-name="project.series.name"
            :ensemble-share="project.contract.artistShare"
            :project-id="project.id"
          />
          <Button
            :text="$store.state.copy.support_btn_text"
            bg-color="green-light"
            class="mx-auto w-full"
            style="max-width: 500px;"
            @click="goToSalesPage"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import GroupCard from '@/components/items/GroupCard.vue';
import PreviewCard from '@/components/items/PreviewCard.vue';
import SupportCard from '@/components/items/SupportCard.vue';

export default {
  name: 'ProjectModule',
  components: { Button, GroupCard, PreviewCard, SupportCard },
  props: {
    project: Object
  },
  methods: {
    goToSalesPage() {
      this.$router.push({
        name: 'sales-page',
        params: { projectId: this.project.id }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
