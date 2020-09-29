<template>
  <div
    id="app-container"
    :class="['vh-100', { 'nav-is-active': navIsActive }]"
    class="relative flex flex-col w-full bg-dark-700"
    @click.self="navIsActive = false"
  >
    <NavBar
      :logged-in="$store.getters['loggedIn']"
      :user="user"
      :nav-is-active="navIsActive"
      @open-nav="navIsActive = true"
      @close-nav="navIsActive = false"
    />
    <div id="page" :class="['bg-fog-700', { 'with-app-nav': navIsActive }]">
      <slot></slot>
    </div>
    <div id="app-footer" class="flex flex-wrap justify-between px-8 text-fog-500 font-bold w-full">
      <div class="button">
        TERMS OF SERVICE
      </div>
      <div class="button">
        PRIVACY POLICY
      </div>
    </div>
    <AdminPanel @force-update="$forceUpdate()" />
  </div>
</template>

<script>
import AdminPanel from '@/components/nav/AdminPanel.vue';
import NavBar from '@/components/nav/NavBar.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'AppContainer',
  components: {
    AdminPanel,
    NavBar
  },
  data() {
    return {
      navIsActive: false
    };
  },
  computed: {
    ...mapState(['user', 'copy', 'editing']),
    ...mapGetters({
      'loggedIn': 'loggedIn',
      'isSuperAdmin': 'user/isSuperAdmin'
    }),
  },
  mounted() {
    this.$store.dispatch('loadAppCopy');
  }
};
</script>

<style lang="scss" scoped>
#app-container {
  resize: both;
  > * {
    flex: 0 0 auto;
  }
}

#page {
  position: relative;
  width: 100vw;
  height: calc(calc(var(--vh, 1vh) * 100) - 60px);
  left: 50%;
  top: calc(50% - 31px);
  transform: translate(-50%, -50%);
  transition: transform 300ms ease;
  transform-origin: center center;
  max-width: 100%;
  max-height: 100%;
  z-index: 10;
}

#page.with-app-nav {
  pointer-events: none;
  @include for-size(phone-only) {
    transform: translate(-50%, -50%) scale(var(--ms)) !important;
    transition: transform 300ms ease;
  }
  @include for-size(tablet-portrait-up) {
    transform: translate(-50%, -50%) scale(var(--ts)) !important;
    transition: transform 300ms ease;
  }
  @include for-size(small-desktop-up) {
    transform: translate(-50%, -50%) scale(var(--ds)) !important;
    transition: transform 300ms ease;
  }
}

#app-footer {
  position: absolute;
  bottom: 20px;
  left: 0px;
  z-index: 1;
}
</style>
