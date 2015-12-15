ViewModel.addBind('contenteditable', function(p) {
  p.autorun(function() {
    if(p.vm[p.property]()) {
      p.element.attr('contenteditable', true);
    } else {
      p.element.removeAttr('contenteditable');
    }
  });
});




