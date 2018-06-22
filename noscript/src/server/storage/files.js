const path = require('path');
const fs = require('fs');
const config = require('../../../config');
const checkFileExists = require('../utils/check-file-exists');
const removeFile = require('../utils/remove-file');

const imageFolder = path.resolve(
  __dirname,
  '../../../',
  config.server.imageFolder
);

/**
 * Gets recipe image stream
 *
 * @param {number} recipeId
 * @return {Promise.<stream|null>} image file stream, otherwise file not found
 */
async function getRecipeImage(recipeId) {
  const filePath = `${imageFolder}/${recipeId}`;
  const exists = await checkFileExists(filePath);
  if (exists) {
    return fs.createReadStream(filePath);
  }
  return null;
}

/**
 * Adds recipe image
 *
 * @param {number} recipeId
 * @param {stream} fileStream
 * @return {Promise}
 */
function addRecipeImage(recipeId, fileStream) {
  return new Promise(res => {
    const filePath = `${imageFolder}/${recipeId}`;
    const w = fs.createWriteStream(filePath);
    fileStream.pipe(w);
    w.on('close', () => res());
  });
}

/**
 * Deletes recipe image
 *
 * @param {number} recipeId
 * @return {Promise.<boolean>}
 */
async function deleteRecipeImage(recipeId) {
  const filePath = `${imageFolder}/${recipeId}`;
  const exists = await checkFileExists(filePath);
  if (exists) {
    await removeFile(filePath);
  }
  return exists;
}

module.exports = {
  getRecipeImage,
  addRecipeImage,
  deleteRecipeImage
};
