Template.recipeCard.viewmodel('recipeCard', function(data) {
    return {
      
      recipe: data.recipe,
      recipePrev: data.recipe.clone(),
      
      editable: data.editable || false,
      
      discardable: data.discardable || false,
      
      deletable: data.deletable || false,
      
      inEditMode: data.inEditMode.toString() === 'true',
      
      events: $.extend({
        onClose: $.noop,
        onRecipeDelete: $.noop,
        onRecipeAddOrUpdate: $.noop,
        onRecipePhotoChange: $.noop
      }, data.events),
      
      inEditModeExt: function() {
        return function() { return this.inEditMode() }.bind(this);
      },
      
      notInEditMode: function() { return this.inEditMode() },
      
      onEdit: function(e) {
        this.inEditMode(true);
        e.preventDefault();
      },
      
      onSave: function(e) {
        this.inEditMode(false);
        this.events().onRecipeAddOrUpdate(this.recipe());
        this.recipePrev(this.recipe().clone());
        e.preventDefault();
      },
      
      onDiscard: function(e) {
        this.inEditMode(false);
        this.recipe(this.recipePrev().clone());
        e.preventDefault();
      },
      
      onDelete: function(e) {
        this.events().onRecipeDelete(data.recipe._id);
        e.preventDefault();
      },
      
      onClose: function(e) {
        this.inEditMode(false);
        this.events().onClose();
        e.preventDefault();
      },
      
      onIngredientAdd: function() {
        var ingredients = this.recipe().ingredients;
        if (!ingredients) {
          ingredients = [];
        }
        
        ingredients.push({name:'Новый ингредиент'});
        this.recipe(this.recipe());
      },
      
      onIngredientDelete: function(ingredient) {
        var ingredients = this.recipe().ingredients;
        ingredients.splice(ingredients.indexOf(ingredient), 1);
        this.recipe(this.recipe());
      },
      
      onStepAdd: function() {
        var steps = this.recipe().steps;
        if (!steps) {
          steps = [];
        }
        
        steps.push({name:'Новый шаг'});
        this.recipe(this.recipe());
      },
      
      onStepDelete: function(step) {
        var steps = this.recipe().steps;
        steps.splice(steps.indexOf(step), 1);
        this.recipe(this.recipe());
      },
      
      editableAndNotInEditMode: function() {
        return this.editable() && !this.inEditMode();
      },
      
      discardableAndInEditMode: function() {
        return this.discardable() && this.inEditMode();
      },
      
      ingredientListEvents: function() {
        return {
          onAdd: this.onIngredientAdd.bind(this),
          onDelete: this.onIngredientDelete.bind(this)
        };
      },
      
      stepListEvents: function() {
        return {
          onAdd: this.onStepAdd.bind(this),
          onDelete: this.onStepDelete.bind(this)
        };
      },
      
      onRecipePhotoChange: function(photoFile) {
        this.events().onRecipePhotoChange(this.recipe().id, photoFile, function(photoId) {
          this.recipe().photoId = photoId;
          this.recipe(this.recipe());
        }.bind(this));
      },
      
      recipeCardMinEvents: function() {
        return {
          onPhotoChange: this.onRecipePhotoChange.bind(this)
        };
      }
    };
  }, 
  ['recipe',
   'editableAndNotInEditMode',
   'discardableAndInEditMode',
   'onDelete',
   'inEditMode',
   'inEditModeExt',
   'onIngredientAdd',
   'ingredientListEvents',
   'stepListEvents',
   'recipeCardMinEvents']);