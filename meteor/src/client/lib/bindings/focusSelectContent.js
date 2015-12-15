ViewModel.addBind('focusSelectContent', function(p) {
  p.element.on('focus', function () {
    setTimeout(function() {
      var range = document.createRange();
      range.selectNodeContents(p.element[0]);

      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, 10);
  });
});