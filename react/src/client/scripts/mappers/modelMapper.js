define(['models/Recipe'],
    function(Recipe) {

        function mapRecipe(recipeDO) {
            var recipe = new Recipe();

            recipe.id = recipeDO.id;
            recipe.name = recipeDO.name;
            recipe.description = recipeDO.description;
            recipe.photoId = recipeDO.photoId;
            recipe.popularity = recipeDO.popularity || 0;
            recipe.complexity = recipeDO.complexity || 0;
            recipe.ingredients = recipeDO.ingredients || [];
            recipe.steps = recipeDO.steps || [];

            return recipe;
        }

        function mapRecipes(recipeDOs) {
            return recipeDOs.map(mapRecipe);
        }

        return {
            mapRecipe: mapRecipe,
            mapRecipes: mapRecipes
        };
    });
