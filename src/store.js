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
  },
  mutations: {
    [constants.mutations.user](state, user) {
      state.user = user
    },
    [constants.mutations.loginStatus](state, loginStatus) {
      state.loginStatus = loginStatus
    },
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      key: 'vuex-todo-examples',
    }),
  ],
})
