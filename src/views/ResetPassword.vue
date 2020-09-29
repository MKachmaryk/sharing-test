<template>
<div class="w-screen h-full bg-fog-700">
  <head>
    <Button
      bg-color="fog-500"
      class="absolute top-2 right-2"
      color="black"
      icon="close"
      round
      @click="$router.push({ name: 'login' })"
    />
  </head>
  </head>

  <div v-cloak class="rp__container">
    <div class="h5 text-black mb-md">Save & log in</div>
    <input v-model="$v.password.$model" class="h5" type="password" placeholder="NEW PASSWORD" />
    <input
      v-model="$v.repeatPassword.$model"
      class="h5"
      type="password"
      placeholder="CONFIRM PASSWORD"
      @keyup.enter="validateCredentials"
    />
    <div class="caption text-dark-500" style="margin-bottom: 20px; font-weight: 400;">
      <b>PRACTICE SAFE SIGN-IN:</b>
      <br />
      <ul style="list-style-type: circle; list-style-position: inside; padding-left: 0px;">
        <li>Use a long memorable passphrase</li>
        <li>Use a different password everywhere</li>
        <li>Use a password manager</li>
      </ul>
    </div>
    <div style="display: flex; justify-content: flex-end;">
      <Button
        :disabled="!this.$v.password.required"
        text="Set your new password"
        bg-color="blue-light"
        @click="validateCredentials"
      />
    </div>
    <ul v-if="errors" class="si__errors">
      <li v-for="(error, index) in errors" :key="index" class="caption">{{ error }}</li>
    </ul>
    <div v-if="success" class="footnote text-green-500" style="padding-top: 16px;">
      <br />Your password has been reset! Redirecting you to login...
    </div>
  </div>
</div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import { required, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
  name: 'ResetPassword',
  components: {
    Button
  },
  validations: {
    password: { required, minLength: minLength(6) },
    repeatPassword: { sameAsPassword: sameAs('password') }
  },
  data() {
    return {
      errors: null,
      password: null,
      repeatPassword: null,
      success: false
    };
  },
  methods: {
    validateCredentials() {
      this.errors = [];

      if (this.$v.$invalid) {
        this.errors.push("INVALID PASSWORD OR PASSWORD DIDN'T MATCH.");
      } else {
        this.handleResetPassword();
      }
    },
    async handleResetPassword() {
      const url = 'auth/reset-password';
      const body = { password: this.password, token: this.$route.params.token };

      const response = await this.$api.post(url, body);
      if (response.data.success) {
        this.success = true;
        setTimeout(() => {
          this.$router.push({ name: 'login' });
        }, 3000);
      } else {
        console.log({ res: response.data });
        this.errors.push(response.data.error || 'Something went wrong.');
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

.rp__container {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
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
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 10px;
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
