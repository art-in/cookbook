export default {
  recipes: {
    isLoaded: false,
    isLoading: true,
    items: null,

    // sorting
    sortProp: 'name', // 'complexity', 'popularity'
    sortDir: 'asc', // 'desc'

    // paging
    totalCount: 0,
    pageLimit: 3,
    currentPage: 0
  },
  modal: {
    isVisible: false,
    isLoading: false,
    isEditing: false,
    isDeletable: false,
    isCancelable: false,
    isNewRecipe: false,
    isImageChanged: false,
    recipe: null,
    prevRecipe: null
  }
}
