/**
 * Parse JSON in request body parameters.
 * Leave non-JSON parameters as is.
 */
 
module.exports = function() {
    return function (req, res, next) {
      Object.keys(req.body).forEach(function (param) {
        if (req.body[param] && req.body[param].search(/^{/) !== -1)
          req.body[param] = JSON.parse(req.body[param]);
      });
      next();
    };
};