<template>
  <div id="app">
    <app-container>
      <router-view />
    </app-container>
  </div>
</template>

<script>
import AppContainer from '@/components/layout/AppContainer.vue';
require('./assets/sass/style.scss');
import documentVariables from '@/helpers/document-variables.js';

export default {
  name: 'App',
  mixins: [documentVariables],
  components: {
    AppContainer
  },
  data() {
    return {
      userShookPhone: false
    };
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    }
  },
  watch: {
    '$route.query.from': 'verifyUser'
  },
  mounted() {
    this.verifyUser();
    this.registerShakeEvent();
  },
  methods: {
    async verifyUser() {
      if (this.loggedIn && !this.$store.state.user.id) {
        this.$store.dispatch('user/loadAccount');
      }
    },
    registerShakeEvent() {
      // See this awesome blog post: http://www.jeffreyharrell.com/blog/2010/11/creating-a-shake-event-in-mobile-safari/

      if (typeof window.DeviceMotionEvent !== 'undefined') {
        // Shake sensitivity (a lower number is more)
        const sensitivity = 20;

        // Position variables
        let x1 = 0;
        let y1 = 0;
        let z1 = 0;
        let x2 = 0;
        let y2 = 0;
        let z2 = 0;

        // Listen to motion events and update the position
        window.addEventListener(
          'devicemotion',
          e => {
            x1 = e.accelerationIncludingGravity.x;
            y1 = e.accelerationIncludingGravity.y;
            z1 = e.accelerationIncludingGravity.z;
          },
          false
        );

        // Periodically check the position and fire
        // if the change is greater than the sensitivity
        setInterval(() => {
          const change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);

          if (change > sensitivity && change != 0) {
            // document.getElementById('app').classList.remove('bad');
            document.body.classList.add('show-hotjar');
          }

          // Update new position
          x2 = x1;
          y2 = y1;
          z2 = z1;
        }, 150);
      }
    }
  }
};
</script>

<style lang="scss">
@media only screen and (max-width: 640px) {
  #_hj_feedback_container {
    visibility: hidden !important;
  }
  .show-hotjar #_hj_feedback_container {
    visibility: visible !important;
  }
}

button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: none;
}
</style>
