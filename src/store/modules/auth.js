import { UserService, AuthenticationError } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import router from '../../router';

const state = {
  authenticating: false,
  accessToken: StorageService.getToken(),
  authenticationErrorCode: 0,
  authenticationError: ''
};

const getters = {
  loggedIn: state => {
    return state.accessToken ? true : false;
  }
};

const actions = {
  async login({ commit }, { email, password }) {
    commit('loginRequest');

    try {
      const { token } = await UserService.login(email, password);
      commit('loginSuccess', { token });

      // Redirect the user to the page he first tried to visit or to the home view
      router.push({
        path: router.history.current.query.redirect || '/',
        query: { from: 'login' }
      });

      return true;
    } catch (err) {
      if (err instanceof AuthenticationError) {
        commit('loginError', {
          errorCode: err.errorCode,
          errorMessage: err.message
        });
      }

      return false;
    }
  },

  async authLogout({ commit }) {
    await UserService.logout();
    commit('logoutSuccess');
    router.push('/login');
  }
};

const mutations = {
  loginRequest(state) {
    state.authenticating = true;
    state.authenticationError = '';
    state.authenticationErrorCode = 0;
  },

  loginSuccess(state, { token, id }) {
    state.accessToken = token;
    state.authenticating = false;
  },

  loginError(state, { errorCode, errorMessage }) {
    state.authenticating = false;
    state.authenticationErrorCode = errorCode;
    state.authenticationError = errorMessage;
  },

  logoutSuccess(state) {
    state.accessToken = '';
  }
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
};
