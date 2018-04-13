import deepUpdate from '../utils/deep-update'

export default {
  'update-recipe-list': (state, patch) => {
    deepUpdate(state.recipes, patch)
  },

  'update-recipe-form-modal': (state, patch) => {
    deepUpdate(state.modal, patch)
  }
}
