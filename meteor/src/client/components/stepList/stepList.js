Template.stepList.viewmodel('stepList', function(data) {
  return {

    steps: function() {
      return this.templateInstance.view.templateInstance().data.steps;
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
    
    onDelete: function(step) {
      this.events().onDelete(step);
    },
    
    stepItemEvents: function() {
      return {
        onDelete: this.onDelete.bind(this)
      };
    }
    
  };
}, ['stepItemEvents',
    'inEditMode']);