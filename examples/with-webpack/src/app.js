import Vue from 'vue'
import App from './app.vue'
import Vuex from 'vuex'
import vuex from './store/app';

import { broadcast } from '../../../src'

vuex.plugins.push(broadcast(['frameId1', 'frameId2']))
Vue.use(Vuex);
const store = new Vuex.Store(vuex)
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})