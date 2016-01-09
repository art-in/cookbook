export default class RecipeService {
    createRecipe() {
        return {
            Name: '',
            Description: '',
            Complexity: 0,
            Popularity: 0
        };
    }

    getRecipes(sortProp, sortDesc, skip, limit) {
        console.log(`getRecipes(${JSON.stringify(Array.from(arguments))})`);

        return fetch(`api/recipes?sprop=${sortProp}&sdesc=${sortDesc}&` +
                                 `skip=${skip}&limit=${limit}`)
            .then(data => data.json());
    }
}