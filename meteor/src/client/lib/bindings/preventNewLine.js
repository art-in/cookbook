ViewModel.addBind('preventNewLine', function(p) {
  p.element.on('keydown', function(e) {
    // 'Return'
    if (e.keyCode == 13) {
        e.preventDefault();
    }
  });
});