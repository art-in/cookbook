const apiUrl = 'http://localhost:8080/api'

export async function getRecipes () {
  const res = await fetch(`${apiUrl}/recipes`)
  const recipes = await res.json()
  return recipes
}

export async function getRecipe (recipeId) {
  const res = await fetch(`${apiUrl}/recipes/${recipeId}`)
  const recipe = await res.json()
  return recipe
}

export async function putRecipe (recipe) {
  await await fetch(`${apiUrl}/recipes/${recipe.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
}
