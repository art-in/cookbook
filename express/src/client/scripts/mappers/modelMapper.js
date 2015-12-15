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

        function mapRecipeFromVM(recipeVM) {
            var recipe = new Recipe();

            recipe.id = recipeVM.id();
            recipe.name = recipeVM.name();
            recipe.description = recipeVM.description();
            recipe.photoId = recipeVM.photoId();
            recipe.popularity = recipeVM.popularity() || 0;
            recipe.complexity = recipeVM.complexity() || 0;
            recipe.ingredients = recipeVM.ingredients().map(function(ingredient) {
                return ingredient.name()
            }) || [];
            recipe.steps = recipeVM.steps().map(function(step) {
                return step.name()
            }) || [];

            return recipe;
        }

        return {
            mapRecipe: mapRecipe,
            mapRecipes: mapRecipes,
            mapRecipeFromVM: mapRecipeFromVM
        }
    });
