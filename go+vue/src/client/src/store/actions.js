import * as api from '../api'

export function init (store) {
  store.dispatch('loadRecipes')
}

export async function loadRecipes (context) {
  const recipes = await api.getRecipes()
  context.commit('set-recipe-list-items', recipes)
}

export async function onRecipeListItemClick (context, recipe) {
  context.commit('show-recipe-form-modal')
  const fullRecipe = await api.getRecipe(recipe.id)
  context.commit('set-recipe-form-modal-recipe', fullRecipe)
}

export function onRecipeFormModalClose (context) {
  context.commit('hide-recipe-form-modal')
}
