import Vue from 'vue'
import Router from 'vue-router'
import RecipeList from '../components/RecipeList'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'RecipeList',
    component: RecipeList
  }]
})
