window.api = {
  getRecipes(sortProp, sortDir, pageOffset, pageLimit) {
    let query = `?sp=${sortProp}&sd=${sortDir}`;
    query += `&po=${pageOffset}&pl=${pageLimit}`;

    return ns.http(`api/recipes${query}`, {}, {type: 'GET'}).then(recipes => {
      recipes.items.forEach(
        r => (r.imageSrc = r.hasImage && getRecipeImageUrl(r.id))
      );
      return recipes;
    });
  },

  deleteRecipe(recipeId) {
    return ns.http(
      `api/recipes/${recipeId}`,
      {},
      {type: 'DELETE', dataType: null}
    );
  },

  getRecipe(recipeId) {
    return ns
      .http(`api/recipes/${recipeId}`, {}, {type: 'GET'})
      .then(recipe => {
        recipe.imageSrc = recipe.hasImage && getRecipeImageUrl(recipe.id);
        return recipe;
      });
  }
};

const getRecipeImageUrl = recipeId => `api/recipes/${recipeId}/image`;
