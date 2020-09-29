import { configure } from '@storybook/vue';

import Vue from 'vue';

// Import Vue plugins
import Vuex from 'vuex';

// Import your global components.


// Install Vue plugins.
Vue.use(Vuex);

// Register global components.


configure(require.context('../src', true, /\.stories\.js$/), module);