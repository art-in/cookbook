import clone from 'clone'

export default {
  'set-recipe-list-items': (state, recipes) => {
    state.recipes.items = recipes
    state.recipes.isLoaded = true
  },

  'update-recipe-list-item': (state, recipe) => {
    // TODO: can target recipe always be found in list? (no, paging/routing)
    const idx = state.recipes.items.findIndex(r => r.id === recipe.id)
    state.recipes.items.splice(idx, 1, recipe)
  },

  'show-recipe-form-modal': state => {
    state.modal.isVisible = true
    state.modal.isLoaded = false
    state.modal.isEditing = false
  },

  'hide-recipe-form-modal': state => {
    state.modal.isVisible = false
    state.modal.recipe = null
  },

  'set-recipe-form-modal-recipe': (state, payload) => {
    state.modal.recipe = payload
    state.modal.prevRecipe = clone(payload)
    state.modal.isLoaded = true
  },

  'start-edit-recipe-form': state => {
    state.modal.isEditing = true
  },

  'stop-edit-recipe-form': state => {
    state.modal.isEditing = false
  }
}
