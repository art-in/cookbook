import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  recipes: {
    isLoaded: false,
    items: null
  },
  modal: {
    isVisible: false,
    isLoaded: false,
    recipe: null
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
