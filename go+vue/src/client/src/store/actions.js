import clone from '../utils/clone'

import * as api from '../api'
import Recipe from '../model/Recipe'
import Ingredient from '../model/Ingredient'
import Step from '../model/Step'
import router from '../router'

const defaultCurrentPage = 0
const defaultSortProp = 'name'
const defaultSortDir = 'asc'

// TODO: handle API request failures

export async function onRecipeListRouteEnter (context, payload) {
  await onRecipeListRouteUpdate(context, payload)
}

export async function onRecipeListRouteUpdate (context, {to, from}) {
  const recipeId = to.query.rid
  if (!from || recipeId !== from.query.rid) {
    if (recipeId !== undefined) {
      await openRecipeModal(context, recipeId)
    } else {
      closeRecipeModal(context)
    }
  }

  // ensure route updated
  if (!from ||
    to.query.p !== from.query.p ||
    to.query.sp !== from.query.sp ||
    to.query.sd !== from.query.sd
  ) {
    context.commit('update-recipe-list', {
      currentPage: to.query.p !== undefined ? to.query.p : defaultCurrentPage,
      sortProp: to.query.sp || defaultSortProp,
      sortDir: to.query.sd || defaultSortDir
    })

    context.dispatch('loadRecipes')
  }
}

export async function loadRecipes (context) {
  context.commit('update-recipe-list', {isLoading: true})

  const {currentPage, sortProp, sortDir} = context.state.recipes

  const {pageLimit} = context.state.recipes
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
  router.push({
    name: 'recipes',
    query: {
      rid: recipe.id,
      p: context.state.route.query.p,
      sp: context.state.route.query.sp,
      sd: context.state.route.query.sd
    }
  })
}

async function openRecipeModal (context, recipeId) {
  context.commit('update-recipe-form-modal', {
    isVisible: true,
    isLoading: true,
    isEditing: false,
    isDeletable: false,
    isCancelable: false,
    recipe: null,
    isImageChanged: false
  })
  const fullRecipe = await api.getRecipe(recipeId)
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

  router.push({
    name: 'recipes',
    query: {
      p: context.state.route.query.p,
      sp: defaultSortProp === sortProp ? undefined : sortProp,
      sd: defaultSortDir === sortDir ? undefined : sortDir
    }
  })
}

export function onRecipeFormModalClose (context) {
  router.push({
    name: 'recipes',
    query: {
      rid: undefined,
      p: context.state.route.query.p,
      sp: context.state.route.query.sp,
      sd: context.state.route.query.sd
    }
  })
}

function closeRecipeModal (context) {
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
  // TODO: skip server requests if no changes

  const {recipe, isImageChanged} = context.state.modal
  let recipeId = recipe.id

  context.commit('update-recipe-form-modal', {isLoading: true})

  if (context.state.modal.isNewRecipe) {
    recipeId = await api.postRecipe(recipe)
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
      isLoading: false,
      isImageChanged: false
    })
  }

  if (isImageChanged) {
    if (recipe.hasImage) {
      await api.postRecipeImage(recipeId, recipe.imageFile)
    } else {
      await api.deleteRecipeImage(recipeId)
    }
  }

  context.dispatch('loadRecipes')
}

export function onRecipeFormCancel (context) {
  const prevRecipe = context.state.modal.prevRecipe
  context.commit('update-recipe-form-modal', {
    isEditing: false,
    isImageChanged: false,
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
    if (recipe.hasImage) {
      await api.deleteRecipeImage(recipe.id)
    }

    const query = context.state.route.query
    const currentPage = query.p !== undefined ? query.p : defaultCurrentPage

    const {items} = context.state.recipes
    if (currentPage !== 0 && items.length === 1) {
      // jump to prev page if deleting last item on current page
      const pageNumber = currentPage - 1
      router.push({
        name: 'recipes',
        query: {
          p: pageNumber === defaultCurrentPage ? undefined : pageNumber.toString(),
          sp: context.state.route.query.sp,
          sd: context.state.route.query.sd
        }
      })
    } else {
      context.dispatch('loadRecipes')
    }
  }
}

export async function onRecipeListPage (context, pageNumber) {
  router.push({
    name: 'recipes',
    query: {
      p: pageNumber === defaultCurrentPage ? undefined : pageNumber,
      sp: context.state.route.query.sp,
      sd: context.state.route.query.sd
    }
  })
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

export async function onRecipeFormImageChange (context, imageFile) {
  const imageSrc = URL.createObjectURL(imageFile)

  context.commit('update-recipe-form-modal', {
    isImageChanged: true,
    recipe: {
      hasImage: true,
      imageSrc,
      imageFile
    }
  })
}

export async function onRecipeFormImageDelete (context, recipe) {
  context.commit('update-recipe-form-modal', {
    isImageChanged: true,
    recipe: {
      hasImage: false,
      imageSrc: null,
      imageFile: null
    }
  })
}
