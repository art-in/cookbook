import clone from '../utils/clone'

import * as api from '../api'
import Recipe from '../model/Recipe'
import Ingredient from '../model/Ingredient'
import Step from '../model/Step'

// TODO: handle API requests failure

export function init (store) {
  store.dispatch('loadRecipes')
}

export async function loadRecipes (context) {
  context.commit('update-recipe-list', {isLoading: true})

  const {sortProp, sortDir, pageLimit, currentPage} = context.state.recipes
  const pageOffset = currentPage * pageLimit

  const res = await api.getRecipes(sortProp, sortDir, pageOffset, pageLimit)

  context.commit('update-recipe-list', {
    items: res.items,
    totalCount: res.totalCount,
    isLoading: false,
    isLoaded: true
  })
}

export async function onRecipeListItemClick (context, recipe) {
  context.commit('update-recipe-form-modal', {
    isVisible: true,
    isLoading: true,
    isEditing: false,
    isDeletable: false,
    isCancelable: false,
    recipe: null
  })
  const fullRecipe = await api.getRecipe(recipe.id)
  context.commit('update-recipe-form-modal', {
    recipe: fullRecipe,
    isLoading: false,
    isDeletable: true,
    isCancelable: true,
    isNewRecipe: false
  })
}

export function onRecipeListAdd (context) {
  const recipe = new Recipe()

  // TODO: focus recipe name input
  context.commit('update-recipe-form-modal', {
    recipe,
    isLoading: false,
    isEditing: true,
    isDeletable: false,
    isCancelable: false,
    isNewRecipe: true,
    isVisible: true
  })
}

export function onRecipeListSort (context, sortProp) {
  let {sortDir} = context.state.recipes
  if (sortProp === context.state.recipes.sortProp) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc'
  } else {
    sortDir = 'asc'
  }

  context.commit('update-recipe-list', {
    sortProp,
    sortDir
  })

  context.dispatch('loadRecipes')
}

export function onRecipeFormModalClose (context) {
  context.commit('update-recipe-form-modal', {isVisible: false})
}

export function onRecipeFormEdit (context) {
  const {recipe} = context.state.modal

  context.commit('update-recipe-form-modal', {
    isEditing: true,
    prevRecipe: clone(recipe)
  })
}

export async function onRecipeFormSave (context) {
  // TODO: validate inputs

  const recipe = context.state.modal.recipe

  context.commit('update-recipe-form-modal', {isLoading: true})

  if (context.state.modal.isNewRecipe) {
    const recipeId = await api.postRecipe(recipe)
    const newRecipe = clone(recipe)
    newRecipe.id = recipeId

    context.commit('update-recipe-form-modal', {isVisible: false})
  } else {
    await api.putRecipe(recipe)

    // update recipe in the list
    // TODO: will target recipe always be in the list? (no, paging/routing)
    const recipes = Array.from(context.state.recipes.items)
    const idx = recipes.findIndex(r => r.id === recipe.id)
    recipes.splice(idx, 1, recipe)

    context.commit('update-recipe-list', {
      items: recipes
    })
    context.commit('update-recipe-form-modal', {
      isEditing: false,
      isLoading: false
    })
  }

  context.dispatch('loadRecipes')
}

export function onRecipeFormCancel (context) {
  const prevRecipe = context.state.modal.prevRecipe
  context.commit('update-recipe-form-modal', {
    isEditing: false,
    recipe: prevRecipe
  })
}

export async function onRecipeFormDelete (context, recipe) {
  await deleteRecipe(context, recipe)
}

export async function onRecipeListItemDelete (context, recipe) {
  await deleteRecipe(context, recipe)
}

export async function deleteRecipe (context, recipe) {
  if (confirm(`Delete recipe "${recipe.name}"?`)) {
    context.commit('update-recipe-form-modal', {isVisible: false})
    context.commit('update-recipe-list', {isLoading: true})

    await api.deleteRecipe(recipe.id)

    const {currentPage, items} = context.state.recipes
    if (currentPage !== 0 && items.length === 1) {
      // jump to prev page if deleting last item on current page
      context.commit('update-recipe-list', {currentPage: currentPage - 1})
    }

    context.dispatch('loadRecipes')
  }
}

export async function onRecipeListPage (context, pageNumber) {
  context.commit('update-recipe-list', {currentPage: pageNumber})
  context.dispatch('loadRecipes')
}

export async function onRecipeFormIngredientAdd (context) {
  const ingredients = Array.from(context.state.modal.recipe.ingredients)
  ingredients.push(new Ingredient())

  // TODO: focus new item input
  context.commit('update-recipe-form-modal', {
    recipe: {ingredients}
  })
}

export async function onRecipeFormIngredientDelete (context, ingredient) {
  const ingredients = Array.from(context.state.modal.recipe.ingredients)
  const idx = ingredients.findIndex(i => i === ingredient)
  ingredients.splice(idx, 1)

  context.commit('update-recipe-form-modal', {
    recipe: {ingredients}
  })
}

export async function onRecipeFormStepAdd (context) {
  const steps = Array.from(context.state.modal.recipe.steps)
  steps.push(new Step())

  // TODO: focus new item input
  context.commit('update-recipe-form-modal', {
    recipe: {steps}
  })
}

export async function onRecipeFormStepDelete (context, step) {
  const steps = Array.from(context.state.modal.recipe.steps)
  const idx = steps.findIndex(i => i === step)
  steps.splice(idx, 1)

  context.commit('update-recipe-form-modal', {
    recipe: {steps}
  })
}
