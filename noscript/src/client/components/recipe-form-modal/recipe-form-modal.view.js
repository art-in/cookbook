ns.View.define('recipe-form-modal', {
  models: ['recipe-form-modal'],
  events: {
    // TODO: binding to element class of child component
    'click .modal__close': 'onModalClose',
    'click .modal__back': 'onModalClose',
    'selecting-recipe': 'onSelectingRecipe'
  },
  methods: {
    onModalClose() {
      this.getModel('recipe-form-modal').onModalClose();
    },
    onSelectingRecipe(event, recipeId) {
      this.getModel('recipe-form-modal').onSelectingRecipe(recipeId);

      // TODO: passing data to child view. looks like hack.
      const recipeFormView = this.views['recipe-form'];
      recipeFormView.info.methods.loadRecipe.call(recipeFormView, recipeId);
    }
  }
});
