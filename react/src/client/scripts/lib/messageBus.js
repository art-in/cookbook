define(['co'], function(co) {
    
    var eventTypes = [];
    
    function publish(eventType, data) {
        if(!eventTypes.some(function (type) { return type === eventType; }))
            console.warn('Publishing event with no subscribers: ' + eventType + ' (' + JSON.stringify(data) + ')');

        var args = Array.prototype.slice.apply(arguments);
        args.shift();

        document.dispatchEvent(new CustomEvent(eventType, {'detail': args}));
    }
    
    function subscribe(eventType, handler) {
        eventTypes.push(eventType);
        
        if (handler.constructor.name === 'GeneratorFunction') {
            handler = co.wrap(handler);
        }
        
        document.addEventListener(eventType, function(e) {
            handler.apply(null, e.detail);
        });
    }
    
    return {
        publish: publish,
        subscribe: subscribe
    };
});
