ViewModel.addBind('numberInput', function(p) {
  var min = parseInt(p.elementBind.min, 10) || 0;
  var max = parseInt(p.elementBind.max, 10) || 10;
  
  // VM -> View
  p.autorun(function() {
    var value = vmProp(p.vm, p.property);
    p.element.html(value);
  });
  
  // View -> VM
  function setValueToVM() {
    var normalizedValue = parseNumber(p.element.html(), min, max);
    p.element.html(normalizedValue);
    vmProp(p.vm, p.property, normalizedValue);
  }
  
  p.element.on('input', function(e) {
    setTimeout(setValueToVM, 500);
  });
  
  p.element.on('blur', setValueToVM);
});

function parseNumber(value, min, max) {
    min = min || 0;
    max = max || Number.POSITIVE_INFINITY;

    var number = value;

    if (typeof number === 'string') {
        number = parseInt(value, 10) || min;
    }

    if (number < min) return min;
    if (number > max) return max;
    return number;
}