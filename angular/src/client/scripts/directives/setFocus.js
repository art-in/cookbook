define(function() {
    return function() {
        return {
            link: function($scope, element, attrs) {
                setTimeout(function() {
                    var range = document.createRange();
                    range.selectNodeContents(element[0]);
        
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }, 10);
            }
        };
    };
});