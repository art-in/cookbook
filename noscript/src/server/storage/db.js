const MongoClient = require('mongodb').MongoClient;
const config = require('../../../config.json');

let recipesCol;

// connect to database
const {url, dbName} = config.server.database;
MongoClient.connect(url)
  .then(client => {
    recipesCol = client.db(dbName).collection('recipes');
    console.log(`Connected to database at '${url}'`);
  })
  .catch(() => {
    console.error(`Unable to connect to database at '${url}'`);
    process.exit();
  });

/**
 * Gets all recipes
 *
 * @param {string} sortProp
 * @param {'asc'|'desc'} sortDir
 * @param {number} pageOffset
 * @param {number} pageLimit
 * @return {Promise.<{items, totalCount}>}
 */
async function getRecipes(sortProp, sortDir, pageOffset, pageLimit) {
  const cursor = recipesCol.find({});

  const itemsPms = cursor
    .sort({[sortProp]: sortDir === 'asc' ? 1 : -1})
    .skip(pageOffset)
    .limit(pageLimit)
    .project({
      _id: 0,
      id: 1,
      name: 1,
      description: 1,
      complexity: 1,
      popularity: 1
    })
    .toArray();

  const countPms = cursor.count();

  return {
    items: await itemsPms,
    totalCount: await countPms
  };
}

/**
 * Adds recipe
 *
 * @param {object} recipe
 */
async function addRecipe(recipe) {
  await recipesCol.insertOne(recipe);
}

/**
 * Gets one recipe
 *
 * @param {number} recipeId
 * @return {object|null} recipe
 */
async function getRecipe(recipeId) {
  return await recipesCol.findOne({id: recipeId}, {projection: {_id: 0}});
}

/**
 * Updates one recipe
 *
 * @param {number} recipeId
 * @param {object} recipe
 * @return {boolean} indicates success, otherwise recipe was not found
 */
async function updateRecipe(recipeId, recipe) {
  const res = await recipesCol.updateOne({id: recipeId}, {$set: recipe});
  return res.matchedCount === 1;
}

/**
 * Deletes one recipe
 *
 * @param {number} recipeId
 * @return {boolean} indicates success, otherwise recipe was not found
 */
async function deleteRecipe(recipeId) {
  const res = await recipesCol.remove({id: recipeId});
  return res.result.n === 1;
}

module.exports = {
  getRecipes,
  addRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe
};
