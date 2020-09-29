<template>
  <div class="notifications-container">
    <div class="h3-mobile pl-sm">NOTIFICATIONS</div>
    <div class="nc-checkbox mb-sm ml-sm">
      <label class="nc-checkbox-text" for="checkbox">
        Send me notifications
        <input v-model="checkAll" id="checkbox" type="checkbox" />
        <span class="checkmark"></span>
      </label>
    </div>
    <table cellspacing="0">
      <tr>
        <th class="h6 text-left l-col">Notification</th>
        <th class="h6 text-left r-col">Emails</th>
      </tr>
      <tr v-for="(state, setting) in settings" :key="setting">
        <td>{{ labels[setting] }}</td>
        <td>
          <CheckIcon
            :class="`setting-${state}`"
            @click="toggleSetting(setting, state)"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import CheckIcon from 'vue-material-design-icons/Check.vue';

export default {
  name: 'SettingsNotificationsContainer',
  components: {
    CheckIcon
  },
  data() {
    return {
      checkAll: null,
      settings: {
        'questions-for-me': true,
        'questions-for-my-work': true,
        answers: true,
        'subscription-projects': true,
        'subscription-assets': true,
        'subscription-bundles': true,
        subscribers: true
      },
      labels: {
        'questions-for-me': 'New questions for me',
        'questions-for-my-work': 'New Questions related to my work',
        answers: 'New answers to my Questions',
        'subscription-projects': 'New Projects started by my subscriptions',
        'subscription-assets': 'New Assets published by my subscriptions',
        'subscription-bundles': 'New Bundles released by my subscriptions',
        subscribers: 'New subscribers'
      }
    };
  },
  watch: {
    checkAll(newVal, oldVal) {
      if (oldVal !== null) {
        this.toggleAllSettings(newVal);
      }
    }
  },
  created() {
    if (this.$store.state.user.settings.hasOwnProperty('questions-for-me')) {
      this.settings = this.$store.state.user.settings;
      this.checkAll = Object.values(this.settings).every(v => v === true);
    }
  },
  methods: {
    toggleSetting(setting, state) {
      this.settings[setting] = !state;
      this.patchSettings();
    },
    toggleAllSettings(state) {
      this.settings = this.$_.mapValues(this.settings, () => state);
      this.patchSettings();
    },
    async patchSettings() {
      const url = `/user?id=eq.${this.$store.state.user.id}`;
      const update = { settings: this.settings };
      const { data } = await this.$pg.patch(url, update);
      this.settings = data[0].settings;
      this.$store.commit('user/setSettings', data[0].settings);
    }
  }
};
</script>

<style lang="scss" scoped>
.notifications-container {
  width: 100%;
  max-width: 450px;
}

.nc-checkbox {
  position: relative;
  height: 38px;
}

.nc-checkbox-text {
  padding-left: 48px;
  line-height: 38px;
}

input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  height: 38px;
  width: 38px;
  border: 0.5px solid #000000;
  background-color: #eee;
}

.checkmark:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

input:checked ~ .checkmark {
  background-color: rgba(0, 0, 0, 0.04);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

input:checked ~ .checkmark:after {
  display: block;
}

.nc-checkbox-text .checkmark:after {
  left: 14px;
  top: 8px;
  width: 9px;
  height: 18px;
  border: solid black;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}

.l-col {
  width: calc(100% - 100px);
}
.r-col {
  width: 100px;
}

th,
td {
  height: 38px;
  padding: 10px;
  border-bottom: 0.5px solid #000000;
}

.material-design-icon,
.material-design-icon__svg {
  width: 24px;
  height: 24px;
}

.setting-true > svg {
  fill: black;
}
.setting-false > svg {
  fill: rgba(0, 0, 0, 0.15);
}
</style>
