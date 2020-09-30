import Vue from 'vue';
import VueMeta from 'vue-meta';
import _ from 'lodash';
import moment from 'moment';
import NProgress from 'nprogress';
import VueCarousel from 'vue-carousel';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import router from './router';
import store from './store/store';
import ApiService from './services/api.service';
import PostgrestService from './services/rest.service';
import { StorageService } from './services/storage.service';
import 'video.js/dist/video-js.css';
import 'vue-material-design-icons/styles.css';

Vue.prototype.$_ = _;
Vue.prototype.$moment = moment;
Vue.prototype.$NProgress = NProgress;
Vue.prototype.$pg = PostgrestService;
Vue.prototype.$eventBus = new Vue();

Vue.use(VueCarousel);
Vue.use(Vuelidate);
Vue.use(VueMeta);

Vue.config.productionTip = false;

// Set the base URL of the API
console.log({ apiBaseUrl: process.env.VUE_APP_API_BASE_URL })
ApiService.init(process.env.VUE_APP_API_BASE_URL);
Vue.prototype.$api = ApiService;

// If token exists set header
if (StorageService.getToken()) {
  ApiService.setHeaders();
}

Vue.filter('capitalize', function(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.mixin({
  methods: {
    setPause(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    formatDuration(secs) {
      const date = new Date(null);
      date.setSeconds(secs);
      let duration = date.toISOString().substr(11, 8);
      if (duration.split(':')[0] === '00') {
        duration = duration
          .split(':')
          .slice(1)
          .join(':');
      }
      return duration;
    },
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
