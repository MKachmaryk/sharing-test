<template>
  <div id="app-nav-bar" class="w-full bg-white">
    <div class="w-full h-full flex justify-between items-center max-w-screen-xl mx-auto py-2 px-3">
      <AppLogo
        class="cursor-pointer nav-app-logo items-end"
        small
        @click="$router.push({ name: 'home' })"
      />
      <Button
        bg-color="dark-100"
        color="black"
        class="anb-centered"
        data-test="app-nav-activator-btn"
        :icon="navIsActive ? 'close' : 'plus'"
        @click="navIsActive ? $emit('close-nav') : $emit('open-nav')"
      />
      <div v-if="!loading && loggedIn" class="flex justify-end items-center">
        <div v-if="user.firstName" class="font-sm mr-sm">{{ user.firstName }}</div>
        <Avatar
          v-if="user.imageUrl"
          size="sm"
          :src="user.imageUrl"
          @click="$router.push({ name: 'settings' })"
        />
        <Button
          v-if="user.cart.length && !navIsActive"
          bg-color="green-light"
          class="ml-2"
          color="black"
          icon="cart"
          @click="$router.push({ name: 'cart-page' })"
        />
        <Button
          v-if="[41, 57, 141].includes(user.id)"
          bg-color="gray-200"
          class="ml-2"
          color="black"
          icon="cog"
          @click="$store.commit('toggleEditMode')"
        />
      </div>
      <Button
        v-if="!loggedIn"
        bg-color="blue-light"
        data-test="login-btn"
        text="login"
        @click="$router.push({ name: 'login' })"
      />
    </div>
  </div>
</template>

<script>
import AppLogo from '@/components/logos/AppLogo.vue';
import Avatar from '@/components/items/Avatar.vue';
import Button from '@/components/buttons/Button.vue';

export default {
  name: 'NavBar',
  components: {
    AppLogo,
    Avatar,
    Button
  },
  props: {
    user: Object,
    loggedIn: {
      type: Boolean,
      required: true
    },
    navIsActive: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  watch: {
    $route: 'closeNav'
  },
  methods: {
    closeNav() {
      this.$emit('deactivate-app-nav');
    }
  }
};
</script>

<style lang="scss" scoped>
#app-nav-bar {
  height: 60px;
}

.anb-centered {
  position: absolute;
  left: calc(50% - 38px / 2);
}

.flex > * {
  flex: none !important;
}
</style>
