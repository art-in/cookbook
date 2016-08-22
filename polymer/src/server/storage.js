import {MongoClient} from 'mongodb';
import config from './app/config';
import debugModule from 'debug';

const debug = debugModule('cookbook:db');

const connectionString = config.get('server:database:connectionString');

let recipesCollection;

(async function () {
    let db = await MongoClient.connect(connectionString);
    console.log('Connected to DB on', connectionString);
    recipesCollection = db.collection('recipes');
})();

/**
 * Returns recipes exist in the data storage.
 *
 * @param {number} skip - how many docs to skip
 * @param {number} limit - how many docs to take
 * @param {string} sortProp - name of property to sort by
 * @param {number} sortDirection - sort direction (1 - asc, -1 - desc)
 * @return {Object} recipes & total count
 */
export async function getRecipes(skip, limit, sortProp, sortDirection) {
    const sortOpts = {};
    sortOpts[sortProp] = sortDirection;

    let cursor = recipesCollection.find({}, {_id: 0});

    const total = await cursor.count(false, {});

    cursor = cursor.sort(sortOpts);

    if (skip) {
        cursor = cursor.skip(skip);
    }

    if (limit) {
        cursor = cursor.limit(limit);
    }

    const recipes = await cursor.toArray();

    debug('[DB] Returning recipes count: ' + recipes.length);
    return {
        items: recipes,
        total
    };
}

/**
 * Adds new recipe to the storage.
 *
 * @param {Object} newRecipe -
 */
export async function addRecipe(newRecipe) {
    const records = await recipesCollection
        .insert(newRecipe);

    debug('[DB] Added new recipe: ' + records);
}

/**
 * Updates existing recipe.
 *
 * @param {string} recipeId -
 * @param {Object} properties -
 */
export async function updateRecipe(recipeId, properties) {
    await recipesCollection
        .update({id: recipeId}, {$set: properties});

    debug('[DB] Recipe updated: ' + recipeId);
}

/**
 * Deletes recipe from the storage.
 * @param {string} recipeId -
 */
export async function deleteRecipe(recipeId) {
    await recipesCollection
        .remove({id: recipeId});

    debug('[DB] Recipe deleted: ' + recipeId);
}
