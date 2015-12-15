define(['jquery', 'co'], function ($, co) {
    return function ($scope, $rootScope, $location, $timeout, 
                     helpers, Recipes, Recipe, ModelMapper) {
        
        $scope.inEditMode = false;
        $scope.isNewRecipe = false;
        $scope.recipeId = '';
        $scope.recipe = null;
        
        function loadRecipe() { co(function* () {
            var query = $location.search();
            
            $scope.isNewRecipe = query.new == 1;
            $scope.inEditMode = $scope.isNewRecipe || query.edit == 1;
            $scope.recipeId = query.rid || $scope.recipeId;
            
            if ($scope.isNewRecipe) {
                var recipe = new Recipe();
                
                recipe.name = 'Новый рецепт';
                recipe.description = 'Краткое описание';
                recipe.popularity = 0;
                recipe.complexity = 0;
                
                $scope.recipe = recipe;
            } else {
                $scope.recipe = yield Recipes.getRecipe($scope.recipeId);
                
                // Antipattern. Applying scope after async action.
                !$scope.$$phase && $scope.$apply();
            }
        })}
        
        this.onEdit = function() {
            $scope.inEditMode = true;
        };
        
        this.onSave = co.wrap(function* () {
            $scope.inEditMode = false;
            
            var recipe = ModelMapper.mapRecipeFromVM($scope.recipe);
            
            if ($scope.isNewRecipe) {
                yield Recipes.addRecipe(recipe);
                $rootScope.$broadcast('recipeAdded');
            } else {
                yield Recipes.updateRecipe($scope.recipeId, recipe);
                $rootScope.$broadcast('recipeUpdated');
            }
        });
        
        this.onDiscard = function() {
            $scope.inEditMode = false;
            loadRecipe();
        };
        
        this.onDelete = co.wrap(function* () {
            yield Recipes.deleteRecipe($scope.recipeId);
            $rootScope.$broadcast('recipeDeleted');
        });
        
        this.onClose = function(e) {
            $rootScope.$broadcast('recipeClosing');
        };
        
        this.onIngredientAdd = function() {
            $scope.recipe.ingredients.push({name: 'Новый ингредиент'});
        };
        
        this.onIngredientDelete = function(ingredient) {
            helpers.removeFromArray($scope.recipe.ingredients, ingredient);
        };
        
        this.onStepAdd = function() {
            $scope.recipe.steps.push({name: 'Новый шаг'});
        };
        
        this.onStepDelete = function(step) {
            helpers.removeFromArray($scope.recipe.steps, step);
        };
        
        this.onPhotoSelect = function(e) {
            if ($scope.inEditMode) {
                $timeout(function() {
                    $(e.currentTarget).find('input').click();
                });
            }
        };
        
        this.onPhotoDelete = function(e) {
            $scope.recipe.photoId = '';
            e.stopPropagation();
        };
        
        $scope.onPhotoChange = co.wrap(function* (input) {
            var photoFile = input.files[0];
            if (!photoFile) return; // File dialog was canceled
            yield Recipes.uploadRecipePhoto($scope.recipe.id, photoFile);
            
            $scope.recipe.photoId = $scope.recipe.id;
            
            // Antipattern. Applying scope after async action.
            !$scope.$$phase && $scope.$apply();
      });
        
        loadRecipe();
    };
});