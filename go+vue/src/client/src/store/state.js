export default {
  recipes: {
    isLoaded: false,
    isLoading: true,
    items: null,
    sortProp: 'name', // 'complexity', 'popularity'
    sortDir: 'asc' // 'desc'
  },
  modal: {
    isVisible: false,
    isLoading: false,
    isEditing: false,
    isDeletable: false,
    isCancelable: false,
    isNewRecipe: false,
    recipe: null,
    prevRecipe: null
  }
}
