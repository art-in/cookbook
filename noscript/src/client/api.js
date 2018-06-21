window.api = {
  getRecipes() {
    return ns.http('api/recipes', {}, {type: 'GET'});
  }
};
