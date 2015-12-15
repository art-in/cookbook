/**
 * Represents cookbook recipe.
 * @constructor
 */
define(['lib/helpers'], function (helpers) {

    function Recipe() {
        this.id = helpers.uid();
        this.name = '';
        this.description = '';
        this.photoId = '';
        this.popularity = 0; // [1, 2, 3, ..., 10]
        this.complexity = 0; // [1, 2, 3, ..., 10]
        this.ingredients = []; // string[]
        this.steps = []; // string[]
    }
    
    Recipe.prototype.equals = function(other) {
      return JSON.stringify(this) === JSON.stringify(other);
    };
    
    Recipe.prototype.clone = function() {
      var recipe = new Recipe();
      var copy = JSON.parse(JSON.stringify(this));
      Object.getOwnPropertyNames(copy)
            .forEach(function(prop) { recipe[prop] = copy[prop] });
      return recipe;
    };
    
    return Recipe;
});