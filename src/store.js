import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import constants from '@/constants'

Vue.use(Vuex)

// const store = new Vuex.Store({
export default new Vuex.Store({
  state: {
    user: {},
    loginStatus: false,
    code_verifier: null,
  },
  mutations: {
    [constants.mutations.user](state, user) {
      state.user = user
    },
    [constants.mutations.loginStatus](state, loginStatus) {
      state.loginStatus = loginStatus
    },
    code_verifier(state, code_verifier) {
      state.code_verifier = code_verifier
    },
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      key: 'vuex-todo-examples',
    }),
  ],
})
