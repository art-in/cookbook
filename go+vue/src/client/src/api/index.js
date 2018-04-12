const apiUrl = 'http://localhost:8080/api'

export async function getRecipes (sortProp, sortDir, pageOffset, pageLimit) {
  const query = `?sp=${sortProp}&sd=${sortDir}&po=${pageOffset}&pl=${pageLimit}`
  const res = await fetch(`${apiUrl}/recipes${query}`)
  const recipes = await res.json()
  return recipes
}

export async function getRecipe (recipeId) {
  const res = await fetch(`${apiUrl}/recipes/${recipeId}`)
  const recipe = await res.json()
  return recipe
}

export async function postRecipe (recipe) {
  const res = await fetch(`${apiUrl}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
  const recipeId = await res.json()
  return recipeId
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

export async function deleteRecipe (recipeId) {
  await await fetch(`${apiUrl}/recipes/${recipeId}`, {
    method: 'DELETE'
  })
}
