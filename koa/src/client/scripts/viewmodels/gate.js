/**
 * Gate between view model and API agent levels.
 */
define(['co',
        'transport/apiAgent',
        'lib/helpers', 'lib/messageBus',
        'mappers/modelMapper',
        'mappers/viewModelMapper'],
    function(co,
             apiAgent,
             helpers,
             messageBus,
             modelMapper,
             viewModelMapper) {

        var rootVM;

        function setupHandlers(root) {
            rootVM = root;

            messageBus.subscribe('recipeAdding', onRecipeAdding);
            messageBus.subscribe('recipeUpdating', onRecipeUpdating);
            messageBus.subscribe('recipeDeleting', onRecipeDeleting);
            messageBus.subscribe('recipesSorting', reloadState);
            messageBus.subscribe('recipesPaging', reloadState);
            messageBus.subscribe('recipePhotoUploading', onRecipePhotoUploading);
        }

        function* reloadState() {

            var pageSize = rootVM.views.recipeList.pageSize();
            var pageNumber = rootVM.views.recipeList.pageNumber();

            messageBus.publish('recipesLoading');

            var data = yield apiAgent.getRecipes({
                                skip: (pageNumber === 0) ? 0 : (pageNumber - 1) * pageSize,
                                limit: pageSize,
                                sortProp: rootVM.views.recipeList.sortProp(),
                                sortDirection: rootVM.views.recipeList.sortDirection()
                            });
            
            var total = data.total;
            var recipeDOs = data.recipes;

            // Map to view-models
            var recipes = modelMapper.mapRecipes(recipeDOs);
            var recipeVMs = viewModelMapper.mapRecipes(recipes);

            messageBus.publish('recipesLoaded', {
                total: total,
                recipeVMs: recipeVMs
            });
        }

        //region Handlers

        function* onRecipeAdding(recipeVM) {
            var recipe = modelMapper.mapRecipeFromVM(recipeVM);
            yield apiAgent.addRecipe(recipe);
            yield reloadState;
        }

        function* onRecipeUpdating(recipeVM) {
            var recipe = modelMapper.mapRecipeFromVM(recipeVM);
            yield apiAgent.updateRecipe(recipe.id, recipe);
            yield reloadState;
        }

        function* onRecipeDeleting(recipeVM) {
            yield apiAgent.deleteRecipe(recipeVM.id());
            yield reloadState;
        }

        function* onRecipePhotoUploading(recipeVM, photoFile) {
            yield apiAgent.uploadRecipePhoto(recipeVM.id(), photoFile);
            messageBus.publish('recipePhotoUploaded', recipeVM.id());
        }

        //endregion

        return {
            setupHandlers: setupHandlers,
            reloadState: co.wrap(reloadState)
        };
    });