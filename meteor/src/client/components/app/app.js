/**
 * Top-level view component.
 */
Template.app.viewmodel('app', {
  
  recipes: function() {
    var sort = {};
    sort[Session.get('sortProp')] = parseInt(Session.get('sortDirection'), 10);
    var limit = Session.get('pageSize');
    
    return Recipes.find({}, {sort: sort, limit: limit});
  },
  
  selectedRecipeId: null,
  
  autorun: function() {
    var recipeId = this.selectedRecipeId();
    Session.set('selectedRecipeId', recipeId);
  },
  
  isNew: false,
  
  isNotNew: function() {
    return this.isNew().toString() !== 'true';
  },
  
  selectedRecipe: function() {
    if (this.isNew().toString() === 'true') {
      return this.createRecipe();
    }
    
    if (this.selectedRecipeId()) {
      var recipeDO = Recipes.findOne({id: this.selectedRecipeId()});
      var recipe = recipeDO ? Recipe.fromDO(recipeDO).clone() : null;
      return recipe;
    }
  },
  
  createRecipe: function() {
    var recipe = new Recipe();
    recipe.name = 'Новый рецепт';
    recipe.description = 'Описание';
    return recipe;
  },
  
  onNewRecipe: function() {
    this.isNew(true);
  },
  
  onRecipeCardClose: function() {
    this.selectedRecipeId(null);
    this.isNew(false);
  },
  
  onRecipeSelect: function(recipeId) {
    this.selectedRecipeId(recipeId);
  },
  
  onRecipeDelete: function(recipeId) {
    Recipes.remove({_id:recipeId});
    this.onRecipeCardClose();
  },
  
  onRecipeAddOrUpdate: function(recipe) {
    Recipes.upsert({_id: recipe._id}, recipe);
    
    if (this.isNew()) {
      this.onRecipeCardClose();
    }
  },
  
  recipeListEvents: function() {
    return { 
      onNewRecipe: this.onNewRecipe.bind(this),
      onRecipeSelect: this.onRecipeSelect.bind(this),
      onRecipeDelete: this.onRecipeDelete.bind(this)
    };
  },
  
  onRecipePhotoChange: function(recipeId, photoFile, cb) {
    var name = recipeId;
    var path = 'images/recipes/';
    
    Meteor.saveFile(photoFile, name, path, undefined, function() {
      cb && cb(recipeId);
    }.bind(this));
  },
  
  recipeCardEvents: function() {
    return {
      onClose: this.onRecipeCardClose.bind(this),
      onRecipeDelete: this.onRecipeDelete.bind(this),
      onRecipeAddOrUpdate: this.onRecipeAddOrUpdate.bind(this),
      onRecipePhotoChange: this.onRecipePhotoChange.bind(this)
    };
  },
  
  onUrl: ['selectedRecipeId', 'isNew']
  
}, ['recipes',
    'selectedRecipeId',
    'selectedRecipe',
    'isNew',
    'isNotNew',
    'recipeListEvents',
    'recipeCardEvents']);