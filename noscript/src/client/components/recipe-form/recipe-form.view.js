ns.View.define('recipe-form', {
  models: ['recipe-form'],
  events: {
    'click .recipe-form__action.edit': 'onEdit',
    'click .recipe-form__action.save': 'onSave'
  },
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
    },
    onEdit() {
      this.getModel('recipe-form').onEdit();

      // TODO: passing data to child view. looks like hack.
      const recipeCardView = this.views['recipe-card'];
      recipeCardView.info.methods.setRecipeCard.call(recipeCardView, {
        isEditing: true
      });
    },
    onSave(e) {
      // TODO: validate inputs
      // TODO: skip server requests if no changes

      const $form = $(e.target).closest('.recipe-form');

      const recipeData = {
        name: $form.find('input.recipe-card__name').val(),
        description: $form.find('textarea.recipe-card__description').val(),
        complexity: $form.find('.recipe-card__complexity > input').val(),
        popularity: $form.find('.recipe-card__popularity > input').val()
      };

      this.getModel('recipe-form').onSave(recipeData);
    }
  }
});
