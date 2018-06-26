ns.Model.define('recipe-form-modal', {
  events: {
    'ns-model-init': function() {
      this.setData({
        isVisible: false
      });
    },
    'ns-model-changed': function() {
      // TODO: remove
      console.log('recipe-form-modal ns-model-changed', this.getData());
    }
  },
  methods: {
    onModalClose() {
      this.set('.isVisible', false);
      ns.page.go();
    },
    onSelectingRecipe() {
      this.set('.isVisible', true);
      ns.page.go();
    }
  }
});
