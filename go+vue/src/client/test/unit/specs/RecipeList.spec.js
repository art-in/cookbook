import Vue from 'vue'
import RecipeList from '@/components/RecipeList'

describe('RecipeList.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(RecipeList)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
