var pmongo = require('promised-mongo'),
    config = require('./app/config'),
    debug = require('debug')('cookbook:db');

var connectionString = config.get('server:database:connectionString'),
    RECIPES_COLLECTION = 'recipes';

var db = connect(connectionString);

/**
 * Returns recipes exist in the data storage.
 *
 * @param {number} skip - how many docs to skip
 * @param {number} limit - how many docs to take
 * @param {string} sortProp - name of property to sort by
 * @param {number} sortDirection - sort direction (1 - asc, -1 - desc)
 * @return {Object} recipes & total count
 */
function* getRecipes (skip, limit, sortProp, sortDirection) {
    var sortOpts = {};
    sortOpts[sortProp] = sortDirection;
    
    var cursor = db.collection(RECIPES_COLLECTION)
                   .find({}, {_id: 0});
    
    var total = yield cursor.count(false, {});
    var recipes = yield cursor.sort(sortOpts)
                            .skip(skip)
                            .limit(limit)
                            .toArray();
    
    debug('[DB] Returning recipes count: ' + recipes.length);
    return { recipes, total };
}

/**
 * Adds new recipe to the storage.
 *
 * @param {Object} newRecipe
 */
function* addRecipe(newRecipe) {
    var records = yield db.collection(RECIPES_COLLECTION)
                          .insert(newRecipe);

    debug('[DB] Added new recipe: ' + records);
}

function* getRecipe(recipeId) {
    var recipe = yield db.collection(RECIPES_COLLECTION)
                         .find({id: recipeId})
                         .toArray();
    
    if (!recipe.length) throw Error('Recipe with such id was not found: ' + recipeId);
    
    debug('[DB] Recipe getting: ' + recipeId);
    
    return recipe[0];
}

/**
 * Updates existing recipe.
 *
 * @param {string} recipeId
 * @param {Object} properties
 */
function* updateRecipe(recipeId, properties) {
    yield db.collection(RECIPES_COLLECTION)
            .update({id: recipeId}, { $set: properties });
        
    debug('[DB] Recipe updated: ' + recipeId);
}

/**
 * Deletes recipe from the storage.
 * @param {string} recipeId
 */
function* deleteRecipe(recipeId) {
    yield db.collection(RECIPES_COLLECTION)
            .remove({ id: recipeId });
    
    debug('[DB] Recipe deleted: ' + recipeId);
}

function connect(connectionString) {
  var db = pmongo(connectionString, 
                  {emitError: true, reconnect: false});

  db.connect()
    .catch(function(e) {
      console.log(e);
      process.exit(1);
    });
    
  return db;
}

module.exports = {
    getRecipes: getRecipes,
    addRecipe: addRecipe,
    getRecipe: getRecipe,
    updateRecipe: updateRecipe,
    deleteRecipe: deleteRecipe
};
