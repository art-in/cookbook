Template.recipeList.viewmodel('recipeList', function(data) { 
    return {
    
      events: $.extend({
        onNewRecipe: $.noop,
        onRecipeSelect: $.noop,
        onRecipeDelete: $.noop
      }, data.events),
      
      recipes: function() {
        return this.templateInstance.view.templateInstance().data.recipes;
      },
      
      pages: function() {
        var pages = [];
        var pagesCount = this.getPagesCount();
        
        for(var i=0; i < pagesCount; i++) {
          var page = { page: i, pageDisplayName: i+1 };
          if(this.pageNumber() == i) page.isCurrent = true;
          pages.push(page);
        }
        
        return pages;
      },
      
      getPagesCount: function() {
        var recipesCount = Counts.get('recipes');
        var pagesCount = Math.ceil(recipesCount / Session.get('pageSize'));
        return pagesCount;
      },
      
      pageNumber: function(n) {
        if (n !== undefined) {
          Session.set('pageNumber', n || 0);
          return;
        }
        
        return parseInt(Session.get('pageNumber'), 10);
      },
      
      sortProp: function(prop) {
        if (prop !== undefined) {
          Session.set('sortProp', prop);
          return;
        }
        
        return Session.get('sortProp');
      },
      
      sortDirection: function(dir) {
        if (dir !== undefined) {
          Session.set('sortDirection', dir);
          return;
        }
        
        return Session.get('sortDirection');
      },
      
      onSorting: function(e) {
        var prop;
        if ($(e.target).is('.name')) prop = 'name';
        if ($(e.target).is('.complexity')) prop = 'complexity';
        if ($(e.target).is('.popularity')) prop = 'popularity';
        
        this.pageNumber(0);
        
        var sortDirection = this.sortProp() !== prop ? 1 : -this.sortDirection();
        
        this.sortProp(prop);
        this.sortDirection(sortDirection);
        e.preventDefault();
      },
      
      onPageNext: function(e) {
        var currentPageNumber = this.pageNumber();
        if (currentPageNumber < this.getPagesCount() - 1) {
          this.pageNumber(currentPageNumber + 1);
        }
        e.preventDefault();
      },
      
      onPagePrev: function(e) {
        var currentPageNumber = this.pageNumber();
        if (currentPageNumber > 0) {
          this.pageNumber(currentPageNumber - 1);
        }
        e.preventDefault();
      },
      
      onNewRecipe: function(e) {
        this.events().onNewRecipe();
        e.preventDefault();
      },
      
      onRecipeSelect: function(recipeId) {
        this.events().onRecipeSelect(recipeId);
      },
      
      onRecipeDelete: function(recipeId) {
        this.events().onRecipeDelete(recipeId);
      },
      
      recipeCardMinEvents: function() {
        return {
          onSelect: this.onRecipeSelect.bind(this),
          onDelete: this.onRecipeDelete.bind(this)
        };
      },
      
      // data-bind does not allow expressions inside attribute,
      // so this helper does the trick
      eq: function(prop, value) {
        return this[prop]() === value;
      },
      
      onUrl: ['pageNumber', 'sortProp', 'sortDirection']
    
    };
  },
  ['recipes', 
   'pages', 
   'pageNumber', 
   'eq',
   'recipeCardMinEvents']);

// Use vanilla meteor .events()
// because there is no access to current data-context with 'this' 
// from viewmodel handler, and we need that to get current page from '#each pages'
Template.recipeList.events({
  'click .paging .page-list a': function(e) {
    Template.instance().viewmodel.pageNumber(this.page);
    e.preventDefault();
  }
});