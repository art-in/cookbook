export default {
  'set-recipe-list-items': (state, payload) => {
    state.recipes.items = payload
    state.recipes.isLoaded = true
  },

  'show-recipe-form-modal': state => {
    state.modal.isVisible = true
    state.modal.isLoaded = false
  },

  'hide-recipe-form-modal': state => {
    state.modal.isVisible = false
    state.modal.recipe = null
  },

  'set-recipe-form-modal-recipe': (state, payload) => {
    state.modal.recipe = payload
    state.modal.isLoaded = true
  }
}
