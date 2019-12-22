export default {
  // router state is immutable and can be updated only through router API
  route: {
    rid: null, // recipe id
    sp: null, // sort prop
    sd: null, // sort dir
    p: null // current page
  },

  recipes: {
    isLoaded: false,
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
};
