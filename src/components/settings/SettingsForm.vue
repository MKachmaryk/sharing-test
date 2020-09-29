<template>
  <div class="settings-form">
    <div v-if="type === 'email'">
      <input
        v-model="newEmail"
        class="mb-sm"
        placeholder="New email address"
        required
        type="search"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
      />
      <input
        v-model="currentPassword"
        class="mb-sm"
        placeholder="Confirm with your password"
        required
        type="password"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
      />
    </div>
    <div v-if="type === 'password'">
      <input
        v-model="currentPassword"
        class="mb-sm"
        placeholder="Current password"
        required
        type="password"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
      />
      <input
        v-model="newPassword"
        class="mb-sm"
        placeholder="New password"
        required
        type="password"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
      />
    </div>
    <div class="flex justify-between">
      <Button bg-color="red-light" text="CANCEL" @click="$emit('cancel-edit')" />
      <Button
        :disabled="!fieldsValidated || validating"
        bg-color="green-light"
        :text="`SAVE ${type}`"
        @click="handleSave"
      />
    </div>
    <div v-if="errorMessage" class="pt-sm caption text-red-500">{{ errorMessage }}</div>
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';

import { required, email, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'SettingsForm',
  validations: {
    newEmail: { required, email },
    currentPassword: { required, minLength: minLength(5) },
    newPassword: { required, minLength: minLength(5) }
  },
  components: {
    Button
  },
  props: {
    type: String,
    errorMessage: String
  },
  data() {
    return {
      newEmail: '',
      currentPassword: '',
      newPassword: '',
      validating: false
    };
  },
  computed: {
    fieldsValidated() {
      const { newEmail, currentPassword, newPassword } = this.$v;
      if (this.type === 'email') {
        return !currentPassword.$invalid && !newEmail.$invalid;
      }
      return !currentPassword.$invalid && !newPassword.$invalid;
    }
  },
  watch: {
    errorMessage(newVal, oldVal) {
      if (newVal && !oldVal) this.validating = false;
    }
  },
  methods: {
    handleSave() {
      let params;
      if (this.type === 'email') {
        params = {
          oldEmail: this.$store.state.user.email,
          newEmail: this.newEmail.toLowerCase(),
          password: this.currentPassword
        };
      } else if (this.type === 'password') {
        params = {
          email: this.$store.state.user.email,
          oldPw: this.currentPassword,
          newPw: this.newPassword
        };
      }
      this.$emit('update-credentials', params);
      this.validating = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.settings-form {
  min-width: 280px;
  width: 300px;
  padding: 10px;
  background-color: white;
}

input {
  display: block;
  width: 100%;
  height: 38px;
  padding: 10px;
  outline: none;
  border: 0.5px solid black;
  box-sizing: border-box;
  color: black;
}

input::placeholder,
input:invalid {
  color: rgba(0, 0, 0, 0.15);
}
</style>
