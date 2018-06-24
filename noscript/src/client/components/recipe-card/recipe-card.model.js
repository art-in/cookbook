ns.Model.define('recipe-card', {
  events: {
    'ns-model-init': function() {
      this.setData({
        isEditing: false,
        isDeletable: false
      });
    },
    'ns-model-changed': function() {
      // TODO: remove
      console.log('recipe-card ns-model-changed', this.getData());
    }
  }
});
