<template>
  <div>
    <div
      v-cloak
      id="login-view"
      class="absolute inset-0 flex flex-col justify-between w-screen h-full z-50 overflow-y-scroll px-4"
    >
      <!-- Header -->
      <div class="pt-12 sm:text-center max-w-screen-sm mx-auto mb-8">
        <div class="bird-wrap mx-auto">
          <img :src="birdLogoUrl" />
        </div>
        <div class="font-sm text-lg text-dark-700">Stay tuned</div>
        <div class="text-dark-500 body">
          We're building a better way for artists, curators, and fans to support
          & collaborate with one another
        </div>
      </div>

      <!-- Body -->
      <div
        class="flex flex-col sm:flex-row justify-end sm:justify-between w-full max-w-screen-sm mx-auto mb-4"
      >
        <!-- Work with us -->
        <div class="flex flex-col sm:justify-end items-start w-48 mr-5 mb-8 sm:mb-0">
          <div class="font-sm text-dark-700 uppercase mb-1">Work with us</div>
          <div
            class="text-xs text-dark-500 italic mb-2"
          >Become a partner in a more sustainable ecosystem for the arts</div>
          <Button bg-color="green-light" text="Drop us a line" @click="emailUs" />
        </div>

        <div class="flex flex-col justify-end w-full max-w-sm">
          <!-- Errors -->
          <ul v-if="errors" class="flex flex-col list-none w-full justify-around py-2">
            <li
              class="text-xs text-red-600 mb-xs"
              v-for="(error, index) in errors"
              :key="index"
            >{{ error }}</li>
          </ul>

          <!-- Input credentials  -->
          <div class="text-2xl sm:text-3xl text-black mb-xs">Been here before?</div>
          <input
            v-model="$v.email.$model"
            autofocus="autofocus"
            class="mb-xs"
            :class="inputClasses"
            data-test="email-input"
            placeholder="Email address"
            style="border-top-left-radius: 5px; border-top-right-radius: 5px;"
          />
          <input
            v-model="$v.password.$model"
            class="mb-sm"
            :class="inputClasses"
            data-test="password-input"
            placeholder="Password"
            style="border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;"
            type="password"
            @keyup.enter="validateCredentials"
          />
          <div class="flex justify-between items-center">
            <div
              class="text-xs text-dark-500 cursor-pointer"
              @click="$router.push({ name: 'forgot-password' })"
            >FORGOT SOMETHING?</div>
            <Button
              bg-color="blue-light"
              color="black"
              data-test="handle-login-btn"
              :disabled="
                !this.$v.email.required ||
                  !this.$v.password.required ||
                  validating
              "
              text="Log in"
              @click="validateCredentials"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators';
import Button from '@/components/buttons/Button.vue';

export default {
  name: 'Login',
  components: {
    Button
  },
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(6) }
  },
  data() {
    return {
      errors: null,
      email: null,
      password: null,
      validating: false,
      inputClasses:
        'w-full bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-dark-300',
      birdLogoUrl:
        'https://res.cloudinary.com/clocks/image/upload/v1586410025/loove-labs/free-bird-1_tbtkit.png'
    };
  },
  computed: {
    authError() {
      return this.$store.state.auth.authenticationError;
    }
  },
  methods: {
    pause(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    emailUs() {
      const a = document.createElement('a');
      a.href = 'https://mailchi.mp/fb52a42598d1/motive';
      a.target = '_blank';
      a.click();
    },
    validateCredentials() {
      this.errors = [];
      const vm = this;
      this.validating = true;

      if (vm.$v.email.$invalid) {
        vm.errors.push('INVALID EMAIL ADDRESS');
        this.validating = false;
      }

      if (!vm.$v.password.minLength) {
        vm.errors.push('PASSWORD MUST BE 6+ CHARACTERS');
        this.validating = false;
      }

      if (!vm.errors || vm.errors.length == 0) {
        this.login();
      }
    },
    async login() {
      const data = { email: this.email, password: this.password };
      const loggedIn = await this.$store.dispatch('login', data);
      if (this.authError) {
        this.validating = false;
        this.errors = [this.authError];
        console.log(this.authError);
        this.$NProgress.done();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
[v-cloak] > * {
  display: none;
}

#login-view {
  background: linear-gradient(
    180deg,
    rgba(243, 243, 243, 0.7) 0%,
    #f3f3f3 100%
  );
  backdrop-filter: blur(10px);
}

.bird-wrap {
  @include for-size(tween-screen-down) {
    display: none;
  }
  display: block;
  width: 120px;
  height: 120px;
  padding: 0;
  align-self img {
    width: 100%;
    height: auto;
  }
}

input::placeholder {
  color: #444;
}
</style>
