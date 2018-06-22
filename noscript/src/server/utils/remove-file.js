const fs = require('fs');

/**
 * Removes file
 *
 * @param {string} filePath
 * @return {Promise}
 */
module.exports = function(filePath) {
  return new Promise((res, rej) => {
    fs.unlink(filePath, err => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
};
