var storage = require('./storage.js');
var fs = require("fs");
var path = require("path");

/**
 * Returns recipes.
 *
 * @param {Object} opts
 *
 * @param {Object} [opts.paging]
 * @param {number} [opts.paging.skip=0] - number of recipes to skip
 * @param {number} [opts.paging.limit=POSITIVE_INFINITY] - number of recipes to get
 *
 * @param {Object} [opts.sorting]
 * @param {string} [opts.sorting.prop='name'] - property to sort by
 * @param {number} [opts.sorting.direction=1] - sort direction (1 - asc, -1 - desc)
 *
 * @param {function} cb
 */
function getRecipes(opts, cb) {

    var skip = (!opts || !opts.paging || typeof opts.paging.skip !== 'number') ? 0 : opts.paging.skip;
    var limit = (!opts || !opts.paging || typeof opts.paging.limit !== 'number') ? Number.POSITIVE_INFINITY : opts.paging.limit;
    var sortProp = (!opts || !opts.sorting || !opts.sorting.prop) ? 'name' : opts.sorting.prop;
    var sortDirection = (!opts || !opts.sorting || typeof opts.sorting.direction !== 'number') ? 1 : opts.sorting.direction;

    storage.getRecipes(skip, limit, sortProp, sortDirection,
        function (err, recipes, totalCount) {
            if (err) {
                cb(err);
                return;
            }

            cb(false, {
                total: totalCount,
                recipes: recipes
            });
        });
}

/**
 * Adds new recipe.
 *
 * @param {Object} recipe
 * @param cb
 */
function addRecipe(recipe, cb) {
    if (typeof recipe !== 'object') {
        return cb('Invalid recipe: ' + JSON.stringify(recipe));
    }
    
    storage.addRecipe(recipe, cb);
}

/**
 * Update existing recipe.

 * @param {string} recipeId
 * @param {Object} properties
 * @param cb
 */
function updateRecipe(recipeId, properties, cb) {
    if (typeof properties !== 'object' || !recipeId) {
        cb('Invalid recipe properties: ' + recipeId + ' ' + properties);
        return;
    }

    storage.updateRecipe(recipeId, properties, cb);
}

/**
 * Deletes recipe.
 * @param {string} recipeId
 * @param cb
 */
function deleteRecipe(recipeId, cb) {
    if (!recipeId) {
        cb('Invalid recipe ID: ' + recipeId);
        return;
    }

    storage.deleteRecipe(recipeId, cb);
    
    // remove photo
    var photoPath = path.join(__dirname, '../client/images/recipes/' + recipeId);
    fs.unlink(photoPath, function() {});
}

module.exports = {
    getRecipes: getRecipes,
    addRecipe: addRecipe,
    updateRecipe: updateRecipe,
    deleteRecipe: deleteRecipe
};