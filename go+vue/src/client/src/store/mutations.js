export default {
  'update-recipe-list': (state, payload) => {
    Object.assign(state.recipes, payload)
  },

  'update-recipe-form-modal': (state, payload) => {
    Object.assign(state.modal, payload)
  }
}
