ns.ViewCollection.define('recipe-list', {
  models: ['recipe-list'],
  split: {
    byModel: 'recipe-list',
    intoViews: 'recipe-card'
  },
  events: {
    'click .by-alphabet': 'onSort',
    'click .by-complexity': 'onSort',
    'click .by-popularity': 'onSort'
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
    }
  }
});
