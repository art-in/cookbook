export async function getRecipes () {
  const res = await fetch('http://localhost:8080/api/recipes')
  const recipes = await res.json()
  return recipes
}
