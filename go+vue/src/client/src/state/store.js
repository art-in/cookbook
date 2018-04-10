import Vue from 'vue'
import Vuex from 'vuex'

import * as api from './api'

Vue.use(Vuex)

const state = {
  recipes: null
}

const actions = {
  'load-recipes': async store => {
    const recipes = await api.getRecipes()
    store.commit('set-recipes', recipes)
  }
}

const mutations = {
  'set-recipes': (state, payload) => {
    state.recipes = payload
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
