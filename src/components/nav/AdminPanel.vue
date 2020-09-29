<template>
  <transition name="slide">
    <div v-show="editing" id="app-panel" class="p-4">
      <div class="h4 mb-2">
        EDITOR PANEL
      </div>
      <div class="flex justify-between mb-4">
        <Button bg-color="gray-200" class="mr-xs" text="Close" @click="$store.commit('setEditing', false)" />
        <Button bg-color="green-light" text="Save" @click="handleSave" />
      </div>
    <div v-if="erred" class="mb-md text-red-500 font-bold">
      Oops! Please try again.
    </div>
    <div v-if="succeeded && !erred" class="mb-md text-green-500 font-bold">
      Updates successful.
    </div>
    <div v-for="(value, name, i) in dataModel" :key="'copy-' + i">
      <div class="button mb-2">
        {{ name.toUpperCase()}}
      </div>
      <textarea
        :id="name"
        class="w-full bg-fog-300 appearance-none border border-2 border-gray-200 rounded p-2 focus:outline-none focus:bg-white focus:border-black mb-md"
        v-model="dataModel[name]"
        :name="name"
        rows="4"
      />
    </div>
    </div>
  </transition>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import { mapState } from 'vuex';
import clickOutside from '@/helpers/click-outside';

export default {
  name: 'AdminPanel',
  mixins: [clickOutside],
  components: {
    Button
  },
  data() {
    return {
      dataModel: null,
      erred: false,
      succeeded: false,
    }
  },
  computed: {
  ...mapState(['editing', 'copy']),
    entries() {
      return Object.entries(this.copy).slice(1);
    }
  },
  watch: {
    copy: function (newVal) {
      const { id, ...rest } = newVal;
      this.dataModel = { ...rest };
    },
    editing: function (newVal) {
      if (!newVal) {
        const { id, ...rest } = this.copy;
        this.dataModel = { ...rest };
      }
    }
  },
  methods: {
    async handleSave() {
      const update = this.dataModel;
      const url = '/motive_app?id=eq.1';
        try {
          await this.$pg.patch(url, update);
          this.succeeded = true;
          await this.setPause(1000);
          this.$store.dispatch('loadAppCopy').then(() => {
            this.erred = false;
            this.succeeded = false;
            this.$emit('force-update');
          });
        } catch (err) {
          // eslint-disable-next-line
          console.log({ err });
          this.erred = true;
          this.$NProgress.done();
          setTimeout(() => (this.erred = false), 3000);
        }
    },
  }
}
</script>

<style lang="scss" scoped>
#app-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 300px;
  max-width: 75%;
  background-color: white;
  z-index: 999;
  box-shadow: 3px 0 5px -2px #888;
}

.slide-enter-active,
.slide-leave-active
{
    transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateX(-100%);
    transition: all 150ms ease-in 0s
}

::-webkit-scrollbar {
  width: 17px;
  background-color: transparent;
  display: none;
}
</style>