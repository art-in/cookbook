ns.View.define('recipe-form', {
  models: ['recipe-form'],
  methods: {
    loadRecipe(recipeId) {
      this.getModel('recipe-form')
        .loadRecipe(recipeId)
        .then(recipe => {
          // TODO: passing data to child view. looks like hack.
          const recipeCardView = this.views['recipe-card'];
          recipeCardView.info.methods.setRecipe.call(recipeCardView, recipe);
          recipeCardView.info.methods.setRecipeCard.call(recipeCardView, {
            isDeletable: false
          });
        });
    }
  }
});
