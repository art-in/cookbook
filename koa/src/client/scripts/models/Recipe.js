/**
 * Represents cookbook recipe.
 * @constructor
 */
define(['lib/helpers'], function (helpers) {

    function Recipe() {
        this.id = helpers.uid();
        this.name = '';
        this.description = '';
        this.photoId = this.id;
        this.popularity = 0; // [1, 2, 3, ..., 10]
        this.complexity = 0; // [1, 2, 3, ..., 10]
        this.ingredients = []; // string[]
        this.steps = []; // string[]
    }

    return Recipe;
});