define(['jquery', 'lib/helpers'], function($, helpers) {
    
    var request = helpers.request;
    
    function getRecipes (opts) {
        return request('api/recipes', {
            method: 'GET',
            data: opts,
            dataType: 'json'
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
        getRecipes: getRecipes,
        addRecipe: addRecipe,
        updateRecipe: updateRecipe,
        deleteRecipe: deleteRecipe,
        uploadRecipePhoto: uploadRecipePhoto
    };
});