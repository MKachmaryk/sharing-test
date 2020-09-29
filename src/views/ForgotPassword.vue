<template>
<div id="forgot-password" class="w-screen h-full bg-fog-700">
  <head>
    <Button
      bg-color="fog-500"
      class="absolute top-2 right-2"
      color="black"
      icon="close"
      round
      @click="$router.push({ name: 'home' })"
    />
  </head>

  <div v-cloak class="rp__container max-w-md mx-auto flex flex-col">
    <div class="h5 text-black">Reset your password</div>
    <div class="text-dark-500 mb-md">Enter your email address to send recovery email</div>
    <input
      v-model="$v.email.$model"
      class="h5 mb-md"
      placeholder="EMAIL"
      @keyup.enter="validateCredentials"
    />
    <div class="flex justify-end">
      <Button
        :disabled="!this.$v.email.required"
        text="Send recovery email"
        bg-color="blue-light"
        @click="validateCredentials"
      />
    </div>
    <ul v-if="errors" class="si__errors">
      <li v-for="(error, index) in errors" :key="index" class="caption">{{ error }}</li>
    </ul>
    <div v-if="linkSent" class="footnote text-dark-500" style="pt-md">
      If the email you've specified exists in our system, we have sent you an email with a link to reset your password.
      <br>Redirecting you to the login page...
    </div>
  </div>
</div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'ForgotPassword',
  components: {
    Button
  },
  validations: {
    email: { required, email }
  },
  data() {
    return {
      errors: null,
      email: null,
      linkSent: false
    };
  },
  methods: {
    validateCredentials() {
      this.errors = [];
      const vm = this;

      if (vm.$v.email.$invalid) {
        vm.errors.push('INVALID EMAIL ADDRESS');
      }

      if (!vm.errors || vm.errors.length == 0) {
        this.handleForgotPassword();
      }
    },
    async handleForgotPassword() {
      try {
        console.log('handle');
        const url = 'auth/forgot-password';
        const { data } = await this.$api.post(url, {
          email: this.email.toLowerCase()
        });
        console.log({ data });
        if (data.success) {
          this.linkSent = true;
          setTimeout(() => {
            this.$router.push({ name: 'login' });
          }, 3000);
        } else {
          this.errors.push(data.message);
          console.log(data.error);
          this.$NProgress.done();
        }
      } catch (err) {
        console.log({ error: error.response.data });
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

head {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 160px;
  padding: 20px 20px 0px 20px;
}

input {
  width: 100%;
  padding: 6px 8px;
  background-color: white;
  border: none;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: #7e7e7e;
}

.si__errors {
  display: flex;
  flex-direction: column;
  list-style: none;
  width: 100%;
  justify-content: space-around;
  padding: 10px 0;
  color: #ffbdbd;
  li {
    margin-bottom: 5px;
  }
}

input::placeholder {
  color: #444;
}

button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: none;
}

.close-btn {
  fill: white;
  height: 40px;
  width: 40px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  line-height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.new-idealog-logo {
  height: 32px;
  padding: 0;
}

.text-logo {
  font-size: 24px;
  line-height: 32px;
}
</style>
