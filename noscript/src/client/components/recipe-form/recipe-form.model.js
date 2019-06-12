ns.Model.define('recipe-form', {
  events: {
    'ns-model-init': function() {
      this.setData({
        recipe: null,
        isLoading: false,
        isEditing: false,
        isDeletable: false,
        isCancelable: false,
        isNewRecipe: false,
        isImageChanged: false,
        prevRecipe: null
      });
    },
    'ns-model-changed': function() {
      // TODO: remove
      console.log('recipe-form ns-model-changed', this.getData());
    }
  },
  methods: {
    loadRecipe(recipeId) {
      this.set('.isLoading', true);
      this.set('.isEditing', false);
      this.set('.isDeletable', false);
      this.set('.isCancelable', false);
      ns.page.go();

      return window.api.getRecipe(recipeId).then(recipe => {
        this.setData({
          recipe,
          isLoading: false,
          isDeletable: true,
          isCancelable: true,
          isNewRecipe: false
        });
        ns.page.go();
        return recipe;
      });
    },
    onEdit() {
      this.set('.isEditing', true);
      this.set('.prevRecipe', window.utils.clone(this.get('.recipe')));
      ns.page.go();
    },
    async onSave(recipeData) {
      const recipe = this.get('.recipe');
      Object.assign(recipe, recipeData);

      const isImageChanged = this.get('.isImageChanged');
      const recipeId = this.get('.recipe.id');

      this.set('.isLoading', true);
      ns.page.go();

      if (this.get('.isNewRecipe')) {
        const recipeId = await window.api.postRecipe(recipeData);

        this.set('.recipe.id', recipeId);
        ns.events.trigger('closing-recipe');
      } else {
        await window.api.putRecipe(recipe);

        this.set('.isEditing', false);
        this.set('.isLoading', false);
        this.set('.isImageChanged', false);
      }

      if (isImageChanged) {
        if (recipe.hasImage) {
          await window.api.postRecipeImage(recipeId, recipe.imageFile);
        } else {
          await window.api.deleteRecipeImage(recipeId);
        }
      }

      // TODO: reload recipe list
      console.log(this.get('.recipe'))
      this.invalidate();
      ns.page.go();
    }
  }
});
