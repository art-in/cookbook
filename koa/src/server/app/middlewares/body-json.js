/**
 * Parse JSON in request body parameters.
 * Leave non-JSON parameters as is.
 */
 
module.exports = function () {
    return function* (next) {
        var body = this.request.body;
        
        if (typeof body === 'object') {
            Object.keys(body).forEach(function (param) {
                if (body[param] && body[param].search(/^{/) !== -1)
                    body[param] = JSON.parse(body[param]);
            });
        }
        
        yield* next;
    };
};