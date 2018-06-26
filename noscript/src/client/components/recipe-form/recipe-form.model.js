ns.Model.define('recipe-form', {
  events: {
    'ns-model-init': function() {
      this.setData({
        isLoading: false,
        recipe: null
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
      ns.page.go();

      return window.api.getRecipe(recipeId).then(recipe => {
        this.setData({...this.getData(), isLoading: false, recipe});
        ns.page.go();
        return recipe;
      });
    }
  }
});
