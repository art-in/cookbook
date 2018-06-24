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
  }
};

const getRecipeImageUrl = recipeId => `api/recipes/${recipeId}/image`;
