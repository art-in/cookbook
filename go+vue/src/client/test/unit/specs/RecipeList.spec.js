import Vuex from 'vuex'
import { mount } from '@vue/test-utils'
import { spy } from 'sinon'

import state from 'src/store/state'
import clone from 'src/utils/clone'
import update from 'src/utils/deep-update'

import RecipeList from 'src/components/RecipeList'

const createNewState = patch => update(clone(state), patch)

describe('RecipeList.vue', () => {
  it('should highlight current sort button', () => {
    // setup
    const store = new Vuex.Store({
      state: createNewState({
        recipes: {
          sortProp: 'complexity'
        }
      })
    })

    // target
    const wrapper = mount(RecipeList, {store})

    // check
    expect(wrapper.find('.sorters > .active').text()).to.equal('by complexity')
  })

  it('should highlight current page button', () => {
    // setup
    const store = new Vuex.Store({
      state: createNewState({
        recipes: {
          totalCount: 6,
          currentPage: 1
        }
      })
    })

    // target
    const wrapper = mount(RecipeList, {store})

    // check
    expect(wrapper.find('.pages .active').text()).to.equal('2')
  })

  it('should render button for each page', () => {
    // setup
    const store = new Vuex.Store({
      state: createNewState({
        recipes: {
          totalCount: 7,
          pageLimit: 3
        }
      })
    })

    // target
    const wrapper = mount(RecipeList, {store})

    // check
    expect(wrapper.findAll('.pages button').length).to.equal(3)
  })

  it('should render waiter while recipes are loading', () => {
    // setup
    const store = new Vuex.Store({
      state: createNewState({
        recipes: {
          isLoading: true
        }
      })
    })

    // target
    const wrapper = mount(RecipeList, {store})

    // check
    expect(wrapper.find('.items .waiter').exists()).to.equal(true)
  })

  it('should NOT render waiter after recipes are loaded', () => {
    // setup
    const store = new Vuex.Store({
      state: createNewState({
        recipes: {
          isLoading: false
        }
      })
    })

    // target
    const wrapper = mount(RecipeList, {store})

    // check
    expect(wrapper.find('.items .waiter').exists()).to.equal(false)
  })

  it('should dispatch onRecipeListPage action when paging', () => {
    // setup
    const onRecipeListPage = spy()
    const store = new Vuex.Store({
      state: createNewState({
        recipes: {
          totalCount: 7,
          pageLimit: 3
        }
      }),
      actions: {
        onRecipeListPage
      }
    })

    const wrapper = mount(RecipeList, {store})

    // target
    wrapper.findAll('.pages button').at(2).trigger('click')

    // check
    expect(onRecipeListPage.callCount).to.equal(1)
    expect(onRecipeListPage.getCall(0).args[1]).to.deep.equal(2)
  })
})
