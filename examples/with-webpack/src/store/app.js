import Vue from 'vue'
import Vuex from 'vuex'


const userInfo = {
  // namespaced: true,
  state: () => ({
    username: 'wangtianyou',
    uid: 88042
  }),
  mutations: {
    'change_user': (state, payload) => {
      state.count = state.count + payload
    }
  },
  actions: {
    'set_user': (ctx) => {
      ctx.commit('add_countEE', 100);
    }
  },
  getters: {
    getUsername(s) {
      return s.username
    }
  }
}

Vue.use(Vuex)

export default {
  modules: {
    userInfo: userInfo
  },
  state: {
    count: 0,
    username: 'wangtianyou',
    uid: 88042
  },
  getters: {},
  mutations: {
    'add_count' (state, increasement) {
      state.count = state.count + increasement
    }
  },
  actions: {
    'set_user_main': (ctx) => {
      ctx.commit('add_count', 100);
    }
  },
  plugins: [
    // broadcast('frameId1,frameId2')
  ]
}