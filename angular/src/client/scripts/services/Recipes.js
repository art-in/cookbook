define(function() {
    return function(helpers, ModelMapper) {
        
        var request = helpers.request;
        
        function getRecipe(recipeId) {
            return request('api/recipes/' + recipeId, {
                method: 'GET',
                dataType: 'json'
            }).then(function(recipe) {
                return ModelMapper.mapRecipe(recipe);
            });
        }
        
        function getRecipes (opts) {
            return request('api/recipes', {
                method: 'GET',
                data: opts,
                dataType: 'json'
            }).then(function(data) {
                data.recipes = ModelMapper.mapRecipes(data.recipes);
                return data;
            });
        }
    
        function addRecipe (newRecipe) {
            return request('api/recipes', {
                method: 'POST',
                data: {
                    newRecipe: JSON.stringify(newRecipe)
                }
            });
        }
    
        function updateRecipe (recipeId, properties) {
            return request('api/recipes/' + recipeId, {
                method: 'PUT',
                data: {
                    properties: JSON.stringify(properties)
                }
            });
        }
    
        function deleteRecipe (recipeId) {
            return request('api/recipes/' + recipeId, {
                method: 'DELETE'
            });
        }
    
        function uploadRecipePhoto(recipeId, photoFile) {
            var formData = new FormData();
            formData.append('file', photoFile);
    
            return request('api/recipes/' + recipeId + '/photo',
                        {
                            method: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false
                        });
        }
        
        return {
            getRecipe: getRecipe,
            getRecipes: getRecipes,
            addRecipe: addRecipe,
            updateRecipe: updateRecipe,
            deleteRecipe: deleteRecipe,
            uploadRecipePhoto: uploadRecipePhoto
        };
        
    };
});