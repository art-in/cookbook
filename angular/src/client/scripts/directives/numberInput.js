define(['jquery'], function($) {
    return function($timeout) {
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) throw Error('ng-model not defined');
                
                var min = parseInt(attrs['min'], 10) || 0;
                var max = parseInt(attrs['max'], 10) || 10;
                
                // view -> model
                element.bind('input', function(e) {
                    $timeout(function() {
                        scope.$apply(function() {
                            var normalizedValue = parseNumber(element.html(), min, max);
                            ngModel.$setViewValue(normalizedValue);
                            ngModel.$render();
                        });
                    }, 500);
                });
            }
        };
    };
    
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
});