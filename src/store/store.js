import Vue from 'vue';
import Vuex from 'vuex';
import ApiService from '../services/api.service';
import PostgrestService from '../services/rest.service';
import auth from './modules/auth';
import user from './modules/user';

Vue.use(Vuex);

const state = {
  copy: null,
  unit: null,
  qa: {},
  profile: null,
  project: null,
  spotlights: [],
  indexList: [],
  playerIsPlaying: false,
  loading: false,
  windowWidth: 0,
  windowHeight: 0,
  editing: false
};

const getters = {};

const mutations = {
  setCopy(state, { copy }) {
    state.copy = copy;
  },
  setUnit(state, { unit }) {
    state.unit = unit;
  },
  setSpotlights(state, { spotlights }) {
    state.spotlights = spotlights;
  },
  setIndex(state, { list }) {
    state.indexList = list;
  },
  setQa(state, { qa, entityType }) {
    const initialState = state.qa;
    state.qa = { ...initialState, [entityType]: qa };
  },
  setProject(state, { project }) {
    state.project = project;
  },
  setProfile(state, { profile }) {
    state.profile = profile;
  },
  setPlayerIsPlaying(state, { bool }) {
    state.playerIsPlaying = bool;
  },
  setWindowWidth(state, { windowWidth }) {
    state.windowWidth = windowWidth;
  },
  setWindowHeight(state, { windowHeight }) {
    state.windowHeight = windowHeight;
  },
  setLoading(state, bool) {
    state.loading = bool;
  },
  setEditing(state, bool) {
    state.editing = bool;
  },
  toggleEditMode(state) {
    const oldValue = state.editing;
    state.editing = !oldValue;
  }
};

const actions = {
  loadAppCopy({ commit }) {
    commit('setLoading', true);
    return new Promise(async (resolve, reject) => {
      try {
        const url = '/motive_app?id=eq.1';
        const { data: copy } = await PostgrestService.get(url);
        commit('setCopy', { copy: copy[0] });
        commit('setLoading', false);
        resolve();
      } catch (err) {
        console.log(err);
        reject();
      }
    });
  },
  loadAsset({ commit }, { id }) {
    commit('setLoading', true);
    return new Promise(async (resolve, reject) => {
      try {
        const { data: unit } = await ApiService.get(`api/units/${id}`);
        commit('setUnit', { unit });
        commit('setLoading', false);
        resolve();
      } catch (err) {
        console.log(err);
        reject();
      }
    });
  },
  loadProfile({ commit }, { entityType, entityId }) {
    commit('setLoading', true);
    return new Promise(async (resolve, reject) => {
      try {
        const { data: profile } = await ApiService.get(
          `api/profile/${entityType}/${entityId}`
        );
        commit('setProfile', { profile });
        commit('setLoading', false);
        resolve();
      } catch (err) {
        console.log(err);
        reject();
      }
    });
  },
  loadQa({ commit }, { entityId, entityType }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data: qa } = await ApiService.get(`api/qa/${entityId}`);
        commit('setQa', { qa, entityType });
        resolve();
      } catch (err) {
        console.log(err);
        reject();
      }
    });
  },
  async loadSalesPage({ commit }, { projectId }) {
    commit('setLoading', true);
    return new Promise(async (resolve, reject) => {
      try {
        const { data: project } = await ApiService.get(
          `api/projects/${projectId}`
        );
        commit('setProject', { project });
        commit('setLoading', false);
        resolve();
      } catch (err) {
        console.log(err);
        reject();
      }
    });
  },
  loadIndex({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const [indexRes, spotlightRes] = await Promise.all([
          ApiService.get('api/index'),
          ApiService.get('api/spotlight')
        ]);
        commit('setIndex', { list: indexRes.data });
        commit('setSpotlights', { spotlights: spotlightRes.data });
        resolve();
      } catch (err) {
        console.log(err);
        reject();
      }
    });
  },
  logout({ commit, dispatch }) {
    console.log('heyyyy');
    commit('user/reset');
    commit('setIndex', { list: [] });
    dispatch('authLogout');
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    auth,
    user
  }
});
