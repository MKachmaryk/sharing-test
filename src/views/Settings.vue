<template>
  <div class="settings-page flex flex-col items-center relative w-screen h-full overflow-y-scroll">
    <div class="h2-mobile sp-mb">Settings</div>
    <div class="sp-section-1">
      <div class="sp-acct-wrapper sp-mb">
        <div class="h3-mobile mb-0">ACCOUNT</div>
        <div class="caption text-dark-500 mb-sm">{{ user.email }}</div>
        <transition name="switch" mode="out-in">
          <Button
            v-if="!editingEmail"
            key="edit-email-btn"
            class="mb-sm"
            bg-color="dark-200"
            text="CHANGE EMAIL"
            @click="toggleEmailExpansion"
          />
          <SettingsForm
            v-else
            key="edit-email-form"
            class="mb-sm"
            :error-message="emailErrorMessage"
            type="email"
            @cancel-edit="toggleEmailExpansion"
            @update-credentials="updateCredentials"
          />
        </transition>
        <transition name="switch" mode="out-in">
          <Button
            v-if="!editingPassword"
            class="mb-sm"
            bg-color="dark-200"
            text="CHANGE PASSWORD"
            @click="togglePasswordExpansion"
          />
          <SettingsForm
            v-else
            key="edit-pw-form"
            class="mb-sm"
            :error-message="passwordErrorMessage"
            type="password"
            @cancel-edit="togglePasswordExpansion"
            @update-credentials="updateCredentials"
          />
        </transition>
        <Button bg-color="dark-200" text="EDIT PROFILE" @click="goToProfilePage" />
        <div v-if="successMessage" class="pt-sm mb-sm caption text-purple">{{ successMessage }}</div>
      </div>
      <div class="sp-purchases-wrapper sp-mb">
        <div class="h3-mobile mb-0 pl-sm">PURCHASES</div>
        <div class="caption text-dark-500 mb-sm pl-sm">
          Currently using
          <b>VISA-4101</b>
        </div>
        <div class="flex items-center mb-sm pl-sm">
          <Button
            key="purchase-list"
            :active="!isExpanded"
            class="mr-sm"
            bg-color="dark-200"
            text="PURCHASE HISTORY"
            @click="toggleExpansion"
          />
          <router-link class="body text-link" to="/library">Library &#8594;</router-link>
        </div>
        <transition-group
          name="toggle-item"
          @before-enter="beforeEnter"
          @enter="enter"
          @before-leave="beforeLeave"
          @leave="leave"
        >
          <template v-if="isExpanded" class="flex flex-col">
            <BundleListItem
              v-for="(p, i) in user.purchased"
              :key="`purchases-${i}`"
              :bg-color="p.bundle.image_colors ? p.bundle.image_colors.Vibrant : ''"
              :bundle-id="p.bundle.id"
              class="toggle-item mb-sm"
              :ensemble="p.bundle.project.ensemble"
              :image-url="p.bundle.image_url"
              :name="p.bundle.name"
              :num-credits="p.bundle.project.ensemble.members.length"
              :num-tracks="p.bundle.units[0].children.length"
              :price="p.bundle.price"
              :project-id="p.bundle.project.id"
              :series="p.bundle.project.series"
            />
          </template>
        </transition-group>
      </div>
    </div>
    <SettingsNotificationsContainer class="sp-mb" />
    <div class="flex justify-center sp-mb">
      <Button
        class="mr-sm"
        bg-color="green-light"
        text="EMAIL SUPPORT"
        @click="handleEmailSupportBtnClick"
      />
      <Button bg-color="red-light" text="LOG OUT" @click="handleLogOutBtnClick" />
    </div>
  </div>
</template>

<script>
import BundleListItem from '@/components/items/BundleListItem.vue';
import SettingsForm from '@/components/settings/SettingsForm.vue';
import SettingsNotificationsContainer from '@/components/settings/SettingsNotificationsContainer.vue';
import Button from '@/components/buttons/Button.vue';
import documentVariables from '@/helpers/document-variables';
import toggleExpansion from '@/helpers/toggle-expansion';

import { mapState } from 'vuex';

export default {
  name: 'Settings',
  mixins: [documentVariables, toggleExpansion],
  components: {
    BundleListItem,
    SettingsForm,
    SettingsNotificationsContainer,
    Button
  },
  data() {
    return {
      editingEmail: false,
      editingPassword: false,
      emailErrorMessage: 'Hiiiiiiii',
      passwordErrorMessage: null,
      successMessage: null
    };
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    this.$store.dispatch('user/loadPurchased', true);
  },
  methods: {
    goToProfilePage() {
      this.$router.push({
        name: 'profile',
        params: { entityType: 'user', entityId: this.user.entity_id }
      });
    },
    toggleEmailExpansion() {
      this.editingEmail = !this.editingEmail;
      this.emailErrorMessage = null;
    },
    togglePasswordExpansion() {
      this.editingPassword = !this.editingPassword;
      this.passwordErrorMessage = null;
    },
    async updateEmail(params) {
      this.emailErrorMessage = null;
      try {
        const { data } = await this.$api.put('auth/update-email', params);
        if (!data.success) {
          this.emailErrorMessage = data.message;
          this.$NProgress.done();

          // eslint-disable-next-line
          console.log({ error: data.error });

          return;
        }
        this.toggleEmailExpansion();
        await this.$store.dispatch('user/loadAccount');
        this.successMessage = data.message;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (err) {
        this.emailErrorMessage = 'Invalid entry. Please try again.';
        // eslint-disable-next-line
        console.log({ error: err });
        this.$NProgress.done();
      }
    },
    async updatePassword(params) {
      this.passwordErrorMessage = null;
      try {
        const { data } = await this.$node.put('auth/update-pw', params);
        if (!data.success) {
          this.passwordErrorMessage = data.message;
          // eslint-disable-next-line
          console.log({ error: data.error });
          this.$NProgress.done();
          return;
        }
        this.successMessage = data.message;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.togglePasswordExpansion();
      } catch (err) {
        this.passwordErrorMessage = 'Invalid entry. Please try again.';
        this.$NProgress.done();

        // eslint-disable-next-line
        console.log({ err });
      }
    },
    updateCredentials(params) {
      if (params.oldEmail) {
        this.updateEmail(params);
      } else if (params.oldPw) {
        this.updatePassword(params);
      }
    },
    handleEmailSupportBtnClick() {
      const link = document.createElement('a');
      link.href = 'mailto: we.be@motive.fm';
      document.body.appendChild(link);
      link.click();
      return;
    },
    async handleLogOutBtnClick() {
      if (confirm('Are you sure you want to logout?')) {
        this.$store.dispatch('logout');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.settings-page {
  resize: both;
  padding: 60px 10px;
  @include min-width(640) {
    padding-top: 80px;
    padding-bottom: 80px;
  }
}

.sp-mb {
  margin-bottom: 60px;
  @include min-width(640) {
    margin-bottom: 80px;
  }
}

.sp-section-1 {
  display: flex;
  flex-direction: column;
  width: 100%;
  @include min-width(640) {
    flex-direction: row;
    justify-content: center;
  }
}

.sp-acct-wrapper {
  display: flex;
  flex-direction: column;
  min-width: 280px;
  width: 300px;
  margin-left: 0px;
  padding-left: 10px;
  @include min-width(640) {
    align-items: flex-end;
    margin-left: 0px;
    margin-right: 40px;
  }
}

.sp-purchases-wrapper {
  width: 360px;
  max-width: 100%;
}

.switch-enter-active,
.switch-leave-active {
  transition: opacity 300ms;
}
.switch-enter,
.switch-leave-to {
  opacity: 0;
}
</style>
