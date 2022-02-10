import Vue from 'vue'
import Vuex from 'Vuex';
import AppFrame from './appFrame.vue'
import vuex from './store/app'
import { transfer } from '../../../src'
Vue.use(Vuex);

vuex.plugins.push(transfer({
  created (id) {
    console.log(`iframe[${id}]: created`)
  },
  destroyed (id) {
    console.log(`iframe[${id}]: destroyed`)
  }
}))


const store = new Vuex.Store(vuex)

new Vue({
  el: '#app',
  store,
  components: { AppFrame },
  template: '<AppFrame/>'
})