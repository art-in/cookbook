ns.Model.define('recipe-card', {
  params: {
    // required when splitting unto recipe-cards in recipe-list model
    id: null
  },
  events: {
    'ns-model-init': function() {
      this.setData({
        isEditing: false,
        isDeletable: true
      });
    },
    'ns-model-changed': function() {
      // TODO: remove
      console.log('recipe-card ns-model-changed', this.getData());
    }
  }
});
