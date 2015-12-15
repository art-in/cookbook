Template.ingredientList.viewmodel('ingredientList', function(data) {
  return {

    ingredients: function() {
      return this.templateInstance.view.templateInstance().data.ingredients;
    },
    
    inEditMode: function() {
      return this.templateInstance.view.templateInstance().data.inEditMode;
    },
    
    events: $.extend({
      onAdd: $.noop,
      onDelete: $.noop
    }, data.events),
    
    onAdd: function(e) {
      this.events().onAdd();
      e.preventDefault();
    },
    
    onDelete: function(ingredient) {
      this.events().onDelete(ingredient);
    },
    
    ingredientItemEvents: function() {
      return {
        onDelete: this.onDelete.bind(this)
      };
    }
    
  };
}, ['ingredientItemEvents',
    'inEditMode']);