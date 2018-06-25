ns.Model.define('recipe-list', {
  events: {
    'ns-model-init': function() {
      this.setData({
        sortProp: 'name',
        sortDir: 'asc',
        pageLimit: 3,
        currentPage: 0,
        pages: [],
        recipes: {
          items: [],
          totalCount: 0
        }
      });

      // TODO: why need to invalidate before making request?
      this.invalidate();
      ns.request([this]);
    },

    'ns-model-changed': function() {
      // TODO: remove
      console.log('recipe-list ns-model-changed', this.getData());
    }
  },
  split: {
    items: '.recipes.items',
    model_id: 'recipe',
    params: {
      id: '.id'
    }
  },
  methods: {
    request() {
      const {sortProp, sortDir, currentPage, pageLimit} = this.getData();
      const pageOffset = currentPage * pageLimit;

      return window.api
        .getRecipes(sortProp, sortDir, pageOffset, pageLimit)
        .then(
          data => {
            this.setData({
              ...this.getData(),
              recipes: data
            });

            // update pages
            const pagesCount = Math.ceil(data.totalCount / pageLimit);
            if (this.get('.pages').length !== pagesCount) {
              const pages = [];
              for (let i = 0; i < pagesCount; i++) {
                pages.push({id: i, text: i + 1});
              }
              this.set('.pages', pages);
            }
          },
          error => this.setError(error)
        );
    },

    sort(sortProp) {
      let {sortDir} = this.getData();
      if (sortProp === this.getData().sortProp) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortDir = 'asc';
      }

      this.setData({
        ...this.getData(),
        sortProp,
        sortDir
      });

      this.invalidate();
      ns.request([this]);

      // TODO: why need to init update manually?
      ns.page.go();
    },

    page(pageId) {
      this.set('.currentPage', pageId);

      this.invalidate();
      ns.request([this]);

      ns.page.go();
    }
  }
});
