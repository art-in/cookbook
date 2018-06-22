const fs = require('fs');

/**
 * Check if file exists and accessible for reading
 *
 * @param {string} filePath
 * @return {Promise}
 */
module.exports = function(filePath) {
  return new Promise(res => {
    fs.access(filePath, fs.constants.R_OK, err => {
      res(!err);
    });
  });
};
