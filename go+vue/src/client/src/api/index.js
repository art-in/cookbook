export async function getRecipes () {
  const res = await fetch('http://localhost:8080/api/recipes')
  const recipes = await res.json()
  return recipes
}

export async function getRecipe (recipeId) {
  const res = await fetch(`http://localhost:8080/api/recipes/${recipeId}`)
  const recipe = await res.json()
  return recipe
}
