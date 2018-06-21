ns.Model.define('recipe-list', {
  events: {
    'ns-model-init': function() {
      this.setData({
        recipes: [{id: 1}, {id: 2}, {id: 3}]
      });

      this.invalidate();
      ns.request([this]);
    }
  },
  split: {
    items: '.recipes',
    model_id: 'recipe-card'
  },
  methods: {
    request() {
      return window.api.getRecipes().then(
        function(data) {
          this.setData({recipes: data});
        },
        function(error) {
          this.setError(error);
        },
        this
      );
    }
  }
});
