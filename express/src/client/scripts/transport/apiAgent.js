define(['jquery'], function($) {

    /** Server API methods */
    function getRecipes (opts, cb) {
        $.ajax('api/recipes', {
            method: 'GET',
            data: {
                opts: JSON.stringify(opts)
            },
            dataType: 'json',
            success: cb,
            error: onError
        });
    }

    function addRecipe (newRecipe, cb) {
        $.ajax('api/recipes', {
            method: 'POST',
            data: {
                newRecipe: JSON.stringify(newRecipe)
            },
            success: cb,
            error: onError
        });
    }

    function updateRecipe (recipeId, properties, cb) {
        $.ajax('api/recipes/' + recipeId, {
            method: 'PUT',
            data: {
                properties: JSON.stringify(properties)
            },
            success: cb,
            error: onError
        });
    }

    function deleteRecipe (recipeId, cb) {
        $.ajax('api/recipes/' + recipeId, {
            method: 'DELETE',
            success: cb,
            error: onError
        });
    }

    function uploadRecipePhoto(recipeId, photoFile, cb) {
        var formData = new FormData();
        formData.append('file', photoFile);

        $.ajax('api/recipes/' + recipeId + '/photo',
            {
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: cb,
                error: onError
            });
    }

    function onError(jqXHR, textStatus, errorThrown) {
        jqXHR.responseText && console.error(jqXHR.responseText);
    }

    return {
        getRecipes: getRecipes,
        addRecipe: addRecipe,
        updateRecipe: updateRecipe,
        deleteRecipe: deleteRecipe,
        uploadRecipePhoto: uploadRecipePhoto
    };
});