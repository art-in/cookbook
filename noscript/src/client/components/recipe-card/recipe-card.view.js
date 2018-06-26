ns.View.define('recipe-card', {
  models: ['recipe', 'recipe-card'],
  events: {
    'click button.delete': 'onDelete'
  },
  methods: {
    onDelete(e) {
      const recipeId = this.getModel('recipe').get('.id');
      ns.events.trigger('recipe-card-delete', recipeId);

      // prevent selecting recipe from recipe list
      e.stopPropagation();
    },
    setRecipe(recipe) {
      const recipeModel = this.getModel('recipe');
      recipeModel.setData({...recipeModel.getData(), ...recipe});
    },
    setRecipeCard(recipeCard) {
      const recipeCardModel = this.getModel('recipe-card');
      recipeCardModel.setData({...recipeCardModel.getData(), ...recipeCard});
    }
  }
});
