import Vue from 'vue'
import Vuex from 'vuex'


const userInfo = {
  namespaced: true,
  state: () => ({
    username: 'wangtianyou',
    uid: 88042
  }),
  mutations: {
    'change_user': (state, payload) => {
      state.username = state.username + payload
    }
  },
  actions: {
    'set_user': (ctx) => {
      ctx.commit('add_count', 100);
    }
  },
}

Vue.use(Vuex)

export default {
  modules: {
    userInfo: userInfo
  },
  state: {
    count: 0
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