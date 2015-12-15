// Getter/setter of VM property supporting property nesting ('parentObj.childProp')
vmProp = function vmProp(vm, property, value) {
  var prevProp = null;
  var currentProp = vm;
  var props = property.split('.');
  
  props.forEach(function(prop, idx) {
    prevProp = currentProp;
    
    var isLast = idx === props.length-1;
    
    if (!isLast) {
      if (typeof prevProp[prop] === 'function') {
        currentProp = prevProp[prop]();
      } else {
        currentProp = prevProp[prop];
      }
    } else {
      if (typeof prevProp[prop] === 'function') {
        currentProp = value ? prevProp[prop](value) : prevProp[prop]();
      } else {
        currentProp = value ? prevProp[prop] = value : prevProp[prop];
      }
    }
  });
  
  return currentProp;
};