import clone from 'utils/clone';
import * as api from 'api';
import Recipe from 'model/Recipe';
import Ingredient from 'model/Ingredient';
import Step from 'model/Step';
import st from './state';
import {getHistoryState, setHistoryState} from './bind-history';

const initialState = clone(st);

// TODO: handle API request failures

export function onInit(location) {
  return dispatch => dispatch(onHistoryUpdate(location));
}

// maps history update to store
export function onHistoryUpdate(location) {
  return (dispatch, getState) => {
    const storeState = getState();
    const historyState = getHistoryState(location);

    let reloadRecipes = false;

    if (historyState.recipeId !== storeState.modal.recipeId) {
      // TODO: close modal in case history recipe is unreachable
      if (historyState.recipeId !== undefined) {
        dispatch(openRecipeModal(historyState.recipeId));
      } else {
        dispatch(closeRecipeModal());
      }
    }

    if (
      historyState.sortProp !== storeState.recipes.sortProp ||
      historyState.sortDir !== storeState.recipes.sortDir ||
      historyState.currentPage !== storeState.recipes.currentPage
    ) {
      // TODO: move to first page if history page is unreachable
      dispatch({
        type: 'update-recipe-list',
        data: {
          sortProp: historyState.sortProp,
          sortDir: historyState.sortDir,
          currentPage: historyState.currentPage
        }
      });
      reloadRecipes = true;
    }

    if (storeState.recipes.isFirstLoad || reloadRecipes) {
      dispatch(loadRecipes());
    }
  };
}

// maps store update to history
export function onStoreUpdate(history) {
  return (_, getState) => {
    const storeState = getState();

    const historyState = {
      recipeId: storeState.modal.recipeId,
      sortProp: storeState.recipes.sortProp,
      sortDir: storeState.recipes.sortDir,
      currentPage: storeState.recipes.currentPage
    };

    setHistoryState(history, historyState);
  };
}

export function loadRecipes() {
  return async (dispatch, getState) => {
    dispatch({
      type: 'update-recipe-list',
      data: {isLoading: true, isFirstLoad: false}
    });

    const state = getState();

    const {currentPage, sortProp, sortDir} = state.recipes;

    const {pageLimit} = state.recipes;
    const pageOffset = currentPage * pageLimit;

    const res = await api.getRecipes(sortProp, sortDir, pageOffset, pageLimit);

    dispatch({
      type: 'update-recipe-list',
      data: {
        items: res.items,
        total: res.total,
        isLoading: false
      }
    });
  };
}

export function onRecipeListItemClick(recipe) {
  return dispatch => {
    dispatch(openRecipeModal(recipe.id));
  };
}

function openRecipeModal(recipeId) {
  return async dispatch => {
    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        isVisible: true,
        isLoading: true,
        isEditing: false,
        isDeletable: false,
        isCancelable: false,
        recipe: null,
        recipeId,
        isImageChanged: false
      }
    });

    const recipe = await api.getRecipe(recipeId);

    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        recipe,
        isLoading: false,
        isDeletable: true,
        isCancelable: true,
        isNewRecipe: false
      }
    });
  };
}

export function onRecipeListAdd() {
  return dispatch => {
    const recipe = new Recipe();

    // TODO: focus recipe name input
    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        recipe,
        isLoading: false,
        isEditing: true,
        isDeletable: false,
        isCancelable: false,
        isNewRecipe: true,
        isVisible: true
      }
    });
  };
}

export function onRecipeListSort(sortProp) {
  return (dispatch, getState) => {
    const state = getState();
    let {sortDir, currentPage} = state.recipes;
    if (sortProp === state.recipes.sortProp) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortDir = 'asc';
      currentPage = initialState.recipes.currentPage;
    }

    dispatch({
      type: 'update-recipe-list',
      data: {sortProp, sortDir, currentPage}
    });
    dispatch(loadRecipes());
  };
}

export function onRecipeFormModalClose() {
  return dispatch => dispatch(closeRecipeModal());
}

function closeRecipeModal() {
  return dispatch =>
    dispatch({
      type: 'update-recipe-form-modal',
      data: {isVisible: false, recipeId: undefined, recipe: null}
    });
}

export function onRecipeFormEdit() {
  return (dispatch, getState) => {
    const state = getState();
    const {recipe} = state.modal;
    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        isEditing: true,
        prevRecipe: clone(recipe)
      }
    });
  };
}

export function onRecipeFormSave() {
  return async (dispatch, getState) => {
    // TODO: validate inputs
    // TODO: skip PUT recipe if no changes

    const state = getState();
    const {recipe, isImageChanged} = state.modal;
    let recipeId = recipe.id;

    dispatch({type: 'update-recipe-form-modal', data: {isLoading: true}});

    if (state.modal.isNewRecipe) {
      recipeId = await api.postRecipe(recipe);
      const newRecipe = clone(recipe);
      newRecipe.id = recipeId;

      dispatch({type: 'update-recipe-form-modal', data: {isVisible: false}});
    } else {
      await api.putRecipe(recipe);

      dispatch({
        type: 'update-recipe-form-modal',
        data: {
          isEditing: false,
          isLoading: false,
          isImageChanged: false
        }
      });
    }

    if (isImageChanged) {
      if (recipe.hasImage) {
        await api.postRecipeImage(recipeId, recipe.imageFile);
      } else {
        await api.deleteRecipeImage(recipeId);
      }
    }

    dispatch(loadRecipes());
  };
}

export function onRecipeFormCancel() {
  return (dispatch, getState) => {
    const state = getState();
    const prevRecipe = state.modal.prevRecipe;
    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        isEditing: false,
        isImageChanged: false,
        recipe: prevRecipe
      }
    });
  };
}

export function onRecipeFormChange(recipe) {
  return dispatch =>
    dispatch({type: 'update-recipe-form-modal', data: {recipe}});
}

export function onRecipeFormDelete(recipe) {
  return dispatch => dispatch(deleteRecipe(recipe));
}

export function onRecipeListItemDelete(recipe) {
  return dispatch => dispatch(deleteRecipe(recipe));
}

export function deleteRecipe(recipe) {
  return async (dispatch, getState) => {
    if (confirm(`Delete recipe "${recipe.name}"?`)) {
      const state = getState();

      dispatch(closeRecipeModal());
      dispatch({type: 'update-recipe-list', data: {isLoading: true}});

      await api.deleteRecipe(recipe.id);

      const {currentPage} = state.recipes;

      const {items} = state.recipes;
      if (currentPage !== 0 && items.length === 1) {
        // jump to prev page if deleting last item on current page
        dispatch({
          type: 'update-recipe-list',
          data: {currentPage: currentPage - 1}
        });
      }

      dispatch(loadRecipes());
    }
  };
}

export function onRecipeListPage(pageNumber) {
  return dispatch => {
    dispatch({type: 'update-recipe-list', data: {currentPage: pageNumber}});
    dispatch(loadRecipes());
  };
}

export function onRecipeFormIngredientAdd() {
  return (dispatch, getState) => {
    const state = getState();
    const {ingredients} = state.modal.recipe;
    ingredients.push(new Ingredient());

    // TODO: focus new item input
    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        recipe: {ingredients}
      }
    });
  };
}

export function onRecipeFormIngredientDelete(ingredient) {
  return (dispatch, getState) => {
    const state = getState();
    const {ingredients} = state.modal.recipe;
    const idx = ingredients.findIndex(i => i === ingredient);
    ingredients.splice(idx, 1);

    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        recipe: {ingredients}
      }
    });
  };
}

export function onRecipeFormIngredientChange(ingredient, idx) {
  return (dispatch, getState) => {
    const state = getState();
    const {ingredients} = state.modal.recipe;
    ingredients.splice(idx, 1, ingredient);
    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        recipe: {ingredients}
      }
    });
  };
}

export function onRecipeFormStepAdd() {
  return (dispatch, getState) => {
    const state = getState();
    const {steps} = state.modal.recipe;
    steps.push(new Step());

    // TODO: focus new item input
    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        recipe: {steps}
      }
    });
  };
}

export function onRecipeFormStepDelete(step) {
  return (dispatch, getState) => {
    const state = getState();
    const {steps} = state.modal.recipe;
    const idx = steps.findIndex(i => i === step);
    steps.splice(idx, 1);

    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        recipe: {steps}
      }
    });
  };
}

export function onRecipeFormStepChange(step, idx) {
  return (dispatch, getState) => {
    const state = getState();
    const {steps} = state.modal.recipe;
    steps.splice(idx, 1, step);
    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        recipe: {steps}
      }
    });
  };
}

export function onRecipeFormImageChange(imageFile) {
  return dispatch => {
    const imageSrc = URL.createObjectURL(imageFile);

    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        isImageChanged: true,
        recipe: {
          hasImage: true,
          imageSrc,
          imageFile
        }
      }
    });
  };
}

export function onRecipeFormImageDelete() {
  return dispatch => {
    dispatch({
      type: 'update-recipe-form-modal',
      data: {
        isImageChanged: true,
        recipe: {
          hasImage: false,
          imageSrc: null,
          imageFile: null
        }
      }
    });
  };
}
