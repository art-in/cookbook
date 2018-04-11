import * as api from '../api'

// TODO: handle API requests failure

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

export function onRecipeFormEdit (context) {
  context.commit('start-edit-recipe-form')
}

export async function onRecipeFormSave (context) {
  const recipe = context.state.modal.recipe
  await api.putRecipe(recipe)
  context.commit('update-recipe-list-item', recipe)
  context.commit('stop-edit-recipe-form')
}

export function onRecipeFormCancel (context) {
  const prevRecipe = context.state.modal.prevRecipe
  context.commit('set-recipe-form-modal-recipe', prevRecipe)
  context.commit('stop-edit-recipe-form')
}
