import Vue from 'vue'
import Router from 'vue-router'
import RecipeList from '../components/RecipeList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'recipes',
    component: RecipeList
  }]
})
