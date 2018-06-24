ns.Model.define('recipe', {
  params: {
    // required when splitting unto recipes in recipe-list model
    id: null
  },
  events: {
    'ns-model-changed': function() {
      // TODO: remove
      console.log('recipe ns-model-changed', this.getData());
    }
  }
});
