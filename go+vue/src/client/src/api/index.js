import Recipe from '../model/Recipe'

const getRecipeImageUrl = recipeId => `api/recipes/${recipeId}/image`

export async function getRecipes (sortProp, sortDir, pageOffset, pageLimit) {
  const query = `?sp=${sortProp}&sd=${sortDir}&po=${pageOffset}&pl=${pageLimit}`
  const res = await fetch(`api/recipes${query}`)
  const recipes = await res.json()
  recipes.items.forEach(r =>
    (r.imageSrc = r.hasImage && getRecipeImageUrl(r.id)))
  return recipes
}

export async function getRecipe (recipeId) {
  const res = await fetch(`api/recipes/${recipeId}`)
  const data = await res.json()

  const recipe = new Recipe(data)
  recipe.imageSrc = recipe.hasImage && getRecipeImageUrl(recipe.id)

  return recipe
}

export async function postRecipe (recipe) {
  const res = await fetch(`api/recipes`, {
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
  await fetch(`api/recipes/${recipe.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
}

export async function deleteRecipe (recipeId) {
  await fetch(`api/recipes/${recipeId}`, {
    method: 'DELETE'
  })
}

export async function postRecipeImage (recipeId, imageFile) {
  const formData = new FormData()
  formData.set('file', imageFile)

  await fetch(`api/recipes/${recipeId}/image`, {
    method: 'POST',
    body: formData
  })
}

export async function deleteRecipeImage (recipeId) {
  await fetch(`api/recipes/${recipeId}/image`, {
    method: 'DELETE'
  })
}
