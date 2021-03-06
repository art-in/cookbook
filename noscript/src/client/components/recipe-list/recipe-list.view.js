ns.ViewCollection.define('recipe-list', {
  models: ['recipe-list'],
  split: {
    byModel: 'recipe-list',
    intoViews: 'recipe-card'
  },
  events: {
    'click .by-alphabet': 'onSort',
    'click .by-complexity': 'onSort',
    'click .by-popularity': 'onSort',
    'click .page': 'onPage',
    'click .recipe-card': 'onRecipeCardClick',
    'recipe-card-delete': 'onRecipeCardDelete'
  },
  methods: {
    onSort(e) {
      const classList = e.target.classList;
      let sortProp = '';

      if (classList.contains('by-alphabet')) {
        sortProp = 'name';
      } else if (classList.contains('by-complexity')) {
        sortProp = 'complexity';
      } else if (classList.contains('by-popularity')) {
        sortProp = 'popularity';
      } else {
        throw Error(`Unknown sort properity.`);
      }

      this.getModel('recipe-list').sort(sortProp);
    },
    onPage(e) {
      const pageId = Number(e.target.innerHTML) - 1;
      this.getModel('recipe-list').page(pageId);
    },
    onRecipeCardClick(e) {
      const recipeId = Number(
        $(e.target)
          .closest('.recipe-card')
          .attr('data-recipe-id')
      );
      ns.events.trigger('selecting-recipe', recipeId);
    },
    onRecipeCardDelete(event, recipeId) {
      this.getModel('recipe-list').onRecipeCardDelete(recipeId);
    }
  }
});
