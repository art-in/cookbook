Recipe = function Recipe() {
    this.id = helpers.uid();
    this.name = '';
    this.description = '';
    this.photoId = '';
    this.popularity = 0; // [1, 2, 3, ..., 10]
    this.complexity = 0; // [1, 2, 3, ..., 10]
    this.ingredients = []; // string[]
    this.steps = []; // string[]
};

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

Recipe.fromDO = function (recipeDO) {
    var recipe = new Recipe();
    
    recipe._id = recipeDO._id;
    recipe.id = recipeDO.id;
    recipe.name = recipeDO.name;
    recipe.description = recipeDO.description;
    recipe.photoId = recipeDO.photoId;
    recipe.popularity = recipeDO.popularity || 0;
    recipe.complexity = recipeDO.complexity || 0;
    recipe.ingredients = recipeDO.ingredients || [];
    recipe.steps = recipeDO.steps || [];

    return recipe;
};