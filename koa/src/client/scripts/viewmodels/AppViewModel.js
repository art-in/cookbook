/**
 * Root app view model.
 * @constructor
 */
define(['ko', 'lib/messageBus', 'viewmodels/RecipeViewModel', 'viewmodels/RecipeListViewModel', 'viewmodels/RecipeCardViewModel'],
    function(ko, messageBus, RecipeViewModel, RecipeListViewModel, RecipeCardViewModel) {

        function AppViewModel() {

            this.state = {
                recipes: ko.observableArray([])
            };

            this.views = {
                recipeList: new RecipeListViewModel(this.state),
                recipeCard: new RecipeCardViewModel(this.state)
            };

            messageBus.subscribe('recipeAddStarted', this.onRecipeAddStarted.bind(this));
            messageBus.subscribe('recipeSelecting', this.onRecipeSelecting.bind(this));
        }

        AppViewModel.prototype.onRecipeAddStarted = function() {
            var newRecipeVM = new RecipeViewModel();

            newRecipeVM.name('Новый рецепт');
            newRecipeVM.description('Краткое описание');
            newRecipeVM.popularity(0);
            newRecipeVM.complexity(0);

            this.views.recipeCard.recipe(newRecipeVM);
            this.views.recipeCard.isNewRecipe(true);
            this.views.recipeCard.active(true);
            this.views.recipeCard.inEditMode(true);
        };

        AppViewModel.prototype.onRecipeSelecting = function(recipeVM) {
            this.views.recipeCard.recipe(recipeVM);
            this.views.recipeCard.isNewRecipe(false);
            this.views.recipeCard.active(true);
            this.views.recipeCard.inEditMode(false);
        };

        return AppViewModel;
    });