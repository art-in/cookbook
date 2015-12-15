define(['ko', 'models/Recipe', 'viewmodels/RecipeViewModel'],
    function(ko, Recipe, RecipeViewModel) {

        function mapRecipe(recipe, targetRecipeVM) {
            var recipeVM = targetRecipeVM || new RecipeViewModel();

            recipeVM.id(recipe.id);
            recipeVM.name(recipe.name);
            recipeVM.description(recipe.description);
            recipeVM.photoId(recipe.photoId);
            recipeVM.popularity(recipe.popularity);
            recipeVM.complexity(recipe.complexity);
            recipeVM.ingredients(recipe.ingredients.map(function(ingredient) {
                return { name: ko.observable(ingredient) }}));
            recipeVM.steps(recipe.steps.map(function(step) {
                return { name: ko.observable(step) }}));

            return recipeVM;
        }

        function mapRecipes(recipes) {
            return recipes.map(function(recipe) { return mapRecipe(recipe); });
        }

        return {
            mapRecipe: mapRecipe,
            mapRecipes: mapRecipes
        }
    });
