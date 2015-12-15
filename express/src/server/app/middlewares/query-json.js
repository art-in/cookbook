/**
 * Parse JSON in request query parameters.
 * Leave non-JSON parameters as is.
 */
 
module.exports = function() {
    return function (req, res, next) {
      Object.keys(req.query).forEach(function (param) {
        if (req.query[param] && req.query[param].search(/^{/) !== -1)
          req.query[param] = JSON.parse(req.query[param]);
      });
      next();
    };
};