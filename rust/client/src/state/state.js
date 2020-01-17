export default {
  recipeList: {
    isFirstLoad: true,
    isLoading: true,
    items: null,

    // sorting
    sortProp: 'name', // 'complexity', 'popularity'
    sortDir: 'asc', // 'desc'

    // paging
    total: 0,
    pageLimit: 3,
    currentPage: 0
  },

  recipeForm: {
    isVisible: false,
    isLoading: false,
    isEditing: false,
    isDeletable: false,
    isCancelable: false,
    isNewRecipe: false,
    isImageChanged: false,
    recipe: null,
    recipeId: undefined,
    prevRecipe: null
  },

  imageEditor: {
    isVisible: false,
    imageSrc: null,
    isProcessing: false
  }
};
