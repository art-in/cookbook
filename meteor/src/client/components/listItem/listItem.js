Template.listItem.viewmodel('listItem', function(data) {
  return {
    
    model: function() {
      return this.templateInstance.view.templateInstance().data.model;
    },
    
    className: data.className,
    
    inEditMode: function() {
      return this.templateInstance.view.templateInstance().data.inEditMode;
    },
    
    events: $.extend({
      onDelete: $.noop
    }, data.events),
    
    onDelete: function(e) {
      this.events().onDelete(this.model());
      e.preventDefault();
    }
    
  };
});