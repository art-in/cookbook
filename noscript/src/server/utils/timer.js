// TODO: remove helper method
module.exports = function(ms) {
  return new Promise(res => setTimeout(res, ms));
};
