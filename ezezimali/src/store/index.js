import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      isAuthenticated: false,
      userType: null,
      user: null
    };
  },
  mutations: {
    // Mutation to set the user
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    GET_USERT(state) {
      return state.userType;
    },
    SET_USER_TYPE(state, userType) {
      state.userType = userType;
      // console.log("gdfg",state.userType);
    },

    // Mutation to clear the user
    CLEAR_USER(state) {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  actions: {
    // Action to login the user
    loginUser({ commit }, user, userType) {
      commit('SET_USER', user);
      commit('SET_USER_TYPE', userType);
    },

    setUserType({ commit }, userType) {
      commit('SET_USER_TYPE', userType);
    },
    gettUserType({ state }) {
      return state.userType;
    },

    // Action to logout the user
    logoutUser({ commit }) {
      commit('CLEAR_USER');
    }
  },
  getters: {
    // Getter to check if the user is authenticated
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    getUserType(state) {
      return state.userType;
    },

    // Getter to get the user
    getUser(state) {
      return state.user;
    }
  }
});
