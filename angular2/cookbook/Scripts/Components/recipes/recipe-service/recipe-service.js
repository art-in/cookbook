import {guid} from '../../helpers/helpers';

export default class RecipeService {

    getRecipes(sortProp, sortDesc, skip, limit) {
        console.log(`getRecipes(${JSON.stringify(Array.from(arguments))})`);

        return fetch(`api/recipes?sprop=${sortProp}&sdesc=${sortDesc}&` +
                                 `skip=${skip}&limit=${limit}`)
            .then(data => data.json());
    }

    getRecipe(recipeId) {
        console.log(`getRecipe('${JSON.stringify(Array.from(arguments))}')`);

        return fetch(`api/recipes/${recipeId}`)
               .then(data => data.json());
    }

    createRecipe() {
        return {
            Id: guid(),
            Name: '',
            Description: '',
            Complexity: 0,
            Popularity: 0,
            Ingredients: [],
            Steps: []
        };
    }

    updateRecipe(recipe) {
        console.log(`updateRecipe(${JSON.stringify(Array.from(arguments))})`);

        return fetch(new Request(`api/recipes/${recipe.Id}`, {
            method: 'PUT',
            body: JSON.stringify(recipe),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }

    deleteRecipe(recipeId) {
        console.log(`deleteRecipe(${JSON.stringify(Array.from(arguments))})`);

        return fetch(new Request(`api/recipes/${recipeId}`, {
            method: 'DELETE'
        }));
    }
}