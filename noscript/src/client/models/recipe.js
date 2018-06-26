ns.Model.define('recipe', {
  params: {
    // required when splitting unto recipes in recipe-list model
    id: null
  },
  events: {
    'ns-model-init': function() {
      // prevent server request, since recipe model is used on recipe-form
      this.setData({});
    },
    'ns-model-changed': function() {
      // TODO: remove
      console.log('recipe ns-model-changed', this.getData());
    }
  }
});
