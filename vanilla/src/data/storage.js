var MongoClient = require('../lib/node_modules/mongodb').MongoClient,
    config = require('../lib/config').config;

var connectionString = config.get('database:connectionString'),
    RECIPES_COLLECTION = "recipes";

var db;

/**
 * Returns recipes exist in the data storage.
 *
 * @param {number} skip - how many docs to skip
 * @param {number} limit - how many docs to take
 * @param {string} sortProp - name of property to sort by
 * @param {number} sortDirection - sort direction (1 - asc, -1 - desc)
 * @param {function} cb
 */
function getRecipes (skip, limit, sortProp, sortDirection, cb) {
    var sortOpts = {};
    sortOpts[sortProp] = sortDirection;

    var cursor = db.collection(RECIPES_COLLECTION)
        .find({}, {_id: 0});

    cursor.count(false, {}, function (err, count) {
        cursor.sort(sortOpts)
            .skip(skip)
            .limit(limit)
            .toArray(
            function (err, recipes) {
                !err && console.log('[DB] Returning recipes count: ' + recipes.length);
                cb(err, recipes, count);
            });
    });
}

/**
 * Adds new recipe to the storage.
 *
 * @param {Object} newRecipe
 * @param cb
 */
function addRecipe(newRecipe, cb) {
    db.collection(RECIPES_COLLECTION)
        .insert(newRecipe, function(err, records) {
            !err && console.log('[DB] Added new recipe: ' + records.ops[0].id);
            cb(err);
        })
}

/**
 * Updates existing recipe.
 *
 * @param {string} recipeId
 * @param {Object} properties
 * @param cb
 */
function updateRecipe(recipeId, properties, cb) {
    db.collection(RECIPES_COLLECTION)
        .update({id: recipeId}, { $set: properties },
        function (err) {
            !err && console.log('[DB] Recipe updated: ' + recipeId);
            cb(err, false);
        })
}

/**
 * Deletes recipe from the storage.
 * @param {string} recipeId
 * @param cb
 */
function deleteRecipe(recipeId, cb) {
    db.collection(RECIPES_COLLECTION)
        .remove({ id: recipeId }, function(err) {
            !err && console.log('[DB] Recipe deleted: ' + recipeId);
            cb(err);
        })
}

module.exports = {
    getRecipes: getRecipes,
    addRecipe: addRecipe,
    updateRecipe: updateRecipe,
    deleteRecipe: deleteRecipe
};

// Connect to database.
(function () {
    MongoClient.connect(connectionString,
        function (err, dbContext) {
            if (err) throw err;
            db = dbContext;
        });
})();