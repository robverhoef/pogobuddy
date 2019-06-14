import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    position: null
  },
  mutations: {
    updatePosition (state, position) {
      this.state.position = position
    }
  },
  actions: {
    updatePosition (context, position) {
      context.commit('updatePosition', position)
    }
  },
  strict: true
})
