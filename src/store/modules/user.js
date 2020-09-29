import NProgress from 'nprogress';
import ApiService from '../../services/api.service';
import { UserService, AuthenticationError } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

const getDefaultState = () => {
  return {
    settings: {},
    library: [],
    purchased: [],
    cart: []
  };
};

const state = getDefaultState();

const getters = {
  isSuperAdmin(state) {
    const adminIds = [41, 57, 141];
    return adminIds.includes(state.id);
  }
};

const mutations = {
  reset(state, user) {
    const reset = {
      settings: {},
      library: [],
      purchased: [],
      cart: []
    };
    state = Object.assign(state, reset);
  },
  setAccount(state, user) {
    state = Object.assign(state, user);
  },
  setCart(state, cart) {
    state.cart = cart;
  },
  setLibrary(state, library) {
    state.library = library;
  },
  setPurchased(state, purchases) {
    const purchased = purchases.map(o => o.bundle.id);
    state.purchased = purchases;
  },
  setSettings(state, settings) {
    state.settings = settings;
  },
  reset(state) {
    Object.assign(state, getDefaultState());
  }
};

const load = async (commit, mutation, url) => {
  try {
    const res = await ApiService.get(url);
    commit(mutation, res.data);
  } catch (err) {
    // eslint-disable-next-line
    console.log(`Error: ${err}`);
    NProgress.done();
  }
};

const actions = {
  async loadAccount({ commit, state, dispatch }) {
    console.log('loading authenticated user');
    const token = StorageService.getToken();
    if (!token) return;
    commit('setLoading', true, { root: true });
    await load(commit, 'setAccount', `/api/users/${token}`);
    if (!state.id) {
      dispatch('logout', null, { root: true });
      return;
    }
    const [_, _a] = await Promise.all([
      load(commit, 'setCart', `/api/users/${state.id}/cart`),
      load(commit, 'setPurchased', `/api/users/${state.id}/purchased`)
    ]);
    commit('setLoading', false, { root: true });
  },
  async loadCart({ commit, state, dispatch }) {
    if (!state.id) await dispatch('loadAccount');
    if (!state.id) return [];
    load(commit, 'setCart', `/api/users/${state.id}/cart`);
  },
  async loadLibrary({ commit, state, dispatch }) {
    if (!state.id) await dispatch('loadAccount');
    if (!state.id) return [];
    load(commit, 'setLibrary', `/api/users/${state.id}/library`);
  },
  async loadPurchased({ commit, state, dispatch }, expanded = false) {
    if (!state.id) await dispatch('loadAccount');
    if (!state.id) return [];
    const query = expanded ? '?expanded=true' : '';
    load(commit, 'setPurchased', `/api/users/${state.id}/purchased${query}`);
  },
  async loadSettings({ commit, state, dispatch }) {
    if (!state.id) await dispatch('loadAccount');
    if (!state.id) return {};
    load(commit, 'setSettings', `/api/users/${state.id}/settings`);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
