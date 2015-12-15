define(['jquery'], function($) {

    /** Server API methods */
    var apiMethods = {
        getRecipes: '/api/getRecipes',
        addRecipe: '/api/addRecipe',
        updateRecipe: '/api/updateRecipe',
        deleteRecipe: '/api/deleteRecipe',
        uploadRecipePhoto: '/api/uploadRecipePhoto'
    };

    function getRecipes (opts, cb) {
        $.ajax(apiMethods.getRecipes, {
            method: 'GET',
            data: {
                opts: JSON.stringify(opts)
            },
            dataType: 'json',
            success: cb
        });
    }

    function addRecipe (newRecipe, cb) {
        $.ajax(apiMethods.addRecipe, {
            method: 'GET',
            data: {
                newRecipe: JSON.stringify(newRecipe)
            },
            success: cb
        });
    }

    function updateRecipe (recipeId, properties, cb) {
        $.ajax(apiMethods.updateRecipe, {
            method: 'GET',
            data: {
                recipeId: JSON.stringify(recipeId),
                properties: JSON.stringify(properties)
            },
            success: cb
        });
    }

    function deleteRecipe (recipeId, cb) {
        $.ajax(apiMethods.deleteRecipe, {
            method: 'GET',
            data: {
                recipeId: JSON.stringify(recipeId)
            },
            success: cb
        });
    }

    function uploadRecipePhoto(recipeId, photoFile, cb) {
        var formData = new FormData();
        formData.append('file', photoFile);

        $.ajax(apiMethods.uploadRecipePhoto +
                '?' + $.param({ recipeId: JSON.stringify(recipeId) }),
            {
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: cb
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