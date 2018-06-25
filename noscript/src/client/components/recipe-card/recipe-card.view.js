ns.View.define('recipe-card', {
  models: ['recipe', 'recipe-card'],
  events: {
    'click button.delete': 'onDelete'
  },
  methods: {
    onDelete() {
      const recipeId = this.getModel('recipe').get('.id');
      ns.events.trigger('delete-recipe', recipeId);
    }
  }
});
