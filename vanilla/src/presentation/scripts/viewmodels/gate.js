/**
 * Gate between view model and API agent levels.
 */
define(['lib/transport/apiAgent',
        'lib/helpers', 'lib/messageBus',
        'mappers/modelMapper',
        'mappers/viewModelMapper'],
    function(apiAgent,
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

        function reloadState() {

            var pageSize = rootVM.views.recipeList.pageSize();
            var pageNumber = rootVM.views.recipeList.pageNumber();

            messageBus.publish('recipesLoading');

            apiAgent.getRecipes({
                paging: {
                    skip: pageNumber === 0 ? 0 : (pageNumber - 1) * pageSize,
                    limit: pageSize
                },
                sorting: {
                    prop: rootVM.views.recipeList.sortProp(),
                    direction: rootVM.views.recipeList.sortDirection()
                }
            }, function (data) {
                var total = data.total;
                var recipeDOs = data.recipes;

                // Map to view-models
                var recipes = modelMapper.mapRecipes(recipeDOs);
                var recipeVMs = viewModelMapper.mapRecipes(recipes);

                messageBus.publish('recipesLoaded', {
                    total: total,
                    recipeVMs: recipeVMs
                })
            });
        }

        //region Handlers

        function onRecipeAdding(recipeVM) {
            var recipe = modelMapper.mapRecipeFromVM(recipeVM);

            apiAgent.addRecipe(recipe, reloadState);
        }

        function onRecipeUpdating(recipeVM) {
            var recipe = modelMapper.mapRecipeFromVM(recipeVM);

            apiAgent.updateRecipe(recipe.id, recipe, reloadState);
        }

        function onRecipeDeleting(recipeVM) {
            apiAgent.deleteRecipe(recipeVM.id(), reloadState);
        }

        function onRecipePhotoUploading(recipeVM, photoFile) {
            apiAgent.uploadRecipePhoto(recipeVM.id(), photoFile, function() {
                messageBus.publish('recipePhotoUploaded', recipeVM.id());
            });
        }

        //endregion

        return {
            setupHandlers: setupHandlers,
            reloadState: reloadState
        }
    });