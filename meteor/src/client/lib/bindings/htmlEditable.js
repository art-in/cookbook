ViewModel.addBind('htmlEditable', function(p) {
  // VM -> View
  p.autorun(function() {
    var value = vmProp(p.vm, p.property);
    p.element.html(value);
  });
  
  // View -> VM
  p.element.on('keyup', function() {
    var value = p.element.html();
    vmProp(p.vm, p.property, value);
  });
});