Template.recipeCardMin.viewmodel('recipeCardMin', function(data) { 
    return {
      
      recipe: function() {
        // Getting data passed to this template in reactive way,
        // so any change to it outside will reload this function
        return this.templateInstance.view.templateInstance().data.recipe;
      },
      
      selectable: data.selectable || false,
      
      deletable: data.deletable || false,
      
      inEditMode: data.inEditMode || false,
      
      events: $.extend({
        onSelect: $.noop,
        onDelete: $.noop,
        onPhotoChange: $.noop
      }, 
      data.events),
      
      getRecipePhotoPath: function() {
        return this.recipe().photoId 
                ? 'uploads/images/recipes/' + this.recipe().photoId
                : '';
      },
      
      onSelect: function() {
        if (!this.selectable()) { return }
        this.events().onSelect(data.recipe.id);
      },
      
      onDelete: function(e) {
        this.events().onDelete(data.recipe._id);
        e.stopPropagation();
        e.preventDefault();
      },
      
      onClose: function(e) {
        e.preventDefault();
      },
      
      onPhotoClick: function(e) {
        if ($(e.target).is('input')) return;
        
        if (this.inEditMode()) {
          $(e.currentTarget).find('input').trigger('click');
        }
      },
      
      onPhotoChange: function(e) {
        var file = e.currentTarget.files[0];
        if (file) {
          this.events().onPhotoChange(file);
        }
        
        e.stopPropagation();
      },
      
    };
  },
  ['onSelect',
   'onDelete',
   'deletable', 
   'selectable', 
   'recipe',
   'inEditMode',
   'getRecipePhotoPath',
   'onSelect',
   'onPhotoClick',
   'onPhotoChange']
);