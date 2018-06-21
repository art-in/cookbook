ns.ViewCollection.define('recipe-list', {
  models: ['recipe-list'],
  split: {
    byModel: 'recipe-list',
    intoViews: 'recipe-card'
  }
});
