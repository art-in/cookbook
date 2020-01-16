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
  return async (dispatch, getState) => {
    const storeState = getState();
    const historyState = getHistoryState(location);

    let reloadRecipes = false;

    if (historyState.recipeId !== storeState.recipeForm.recipeId) {
      // TODO: close modal in case history recipe is unreachable
      if (historyState.recipeId !== undefined) {
        await dispatch(openRecipeModal(historyState.recipeId));
      } else {
        dispatch(closeRecipeModal());
      }
    }

    if (
      historyState.sortProp !== storeState.recipeList.sortProp ||
      historyState.sortDir !== storeState.recipeList.sortDir ||
      historyState.currentPage !== storeState.recipeList.currentPage
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

    if (storeState.recipeList.isFirstLoad || reloadRecipes) {
      dispatch(loadRecipes());
    }

    if (historyState.isRecipeEditing !== storeState.recipeForm.isEditing) {
      if (historyState.isRecipeEditing) {
        dispatch(onRecipeFormEdit());
      } else {
        dispatch(onRecipeFormCancel());
      }

      // only allow to edit recipe image when editing recipe itself
      if (
        historyState.isRecipeImageEditing !== storeState.imageEditor.isVisible
      ) {
        if (historyState.isRecipeImageEditing) {
          dispatch(onRecipeFormImageEditing());
        } else {
          dispatch(onImageEditorModalClose());
        }
      }
    }
  };
}

// maps store update to history
export function onStoreUpdate(history) {
  return (_, getState) => {
    const storeState = getState();

    const historyState = {
      recipeId: storeState.recipeForm.recipeId,
      sortProp: storeState.recipeList.sortProp,
      sortDir: storeState.recipeList.sortDir,
      currentPage: storeState.recipeList.currentPage,
      isRecipeEditing: storeState.recipeForm.isEditing,
      isRecipeImageEditing: storeState.imageEditor.isVisible
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

    const {currentPage, sortProp, sortDir} = state.recipeList;

    const {pageLimit} = state.recipeList;
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
      type: 'update-recipe-form',
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
      type: 'update-recipe-form',
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
      type: 'update-recipe-form',
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
    let {sortDir, currentPage} = state.recipeList;
    if (sortProp === state.recipeList.sortProp) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortDir = 'asc';
      currentPage = initialState.recipeList.currentPage;
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
      type: 'update-recipe-form',
      data: {
        isVisible: false,
        recipeId: undefined,
        recipe: null,
        isEditing: false
      }
    });
}

export function onRecipeFormEdit() {
  return (dispatch, getState) => {
    const state = getState();
    const {recipe} = state.recipeForm;
    dispatch({
      type: 'update-recipe-form',
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
    const {recipe, isImageChanged} = state.recipeForm;
    let recipeId = recipe.id;

    dispatch({type: 'update-recipe-form', data: {isLoading: true}});

    if (state.recipeForm.isNewRecipe) {
      recipeId = await api.postRecipe(recipe);
      const newRecipe = clone(recipe);
      newRecipe.id = recipeId;

      dispatch({type: 'update-recipe-form', data: {isVisible: false}});
    } else {
      await api.putRecipe(recipe);

      dispatch({
        type: 'update-recipe-form',
        data: {
          isEditing: false,
          isLoading: false,
          isImageChanged: false
        }
      });
    }

    if (isImageChanged) {
      if (recipe.hasImage) {
        await api.postRecipeImage(recipeId, recipe.imageBlob);
      } else {
        await api.deleteRecipeImage(recipeId);
      }
    }

    // TODO: when recipe image file updated, list still shows old image
    // since image url stays the same. need to trigger image rerender somehow.
    dispatch(loadRecipes());
  };
}

export function onRecipeFormCancel() {
  return (dispatch, getState) => {
    const state = getState();
    const prevRecipe = state.recipeForm.prevRecipe;
    dispatch({
      type: 'update-recipe-form',
      data: {
        isEditing: false,
        isImageChanged: false,
        recipe: prevRecipe
      }
    });
  };
}

export function onRecipeFormChange(recipe) {
  return dispatch => dispatch({type: 'update-recipe-form', data: {recipe}});
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

      const {currentPage} = state.recipeList;

      const {items} = state.recipeList;
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
    const {ingredients} = state.recipeForm.recipe;
    ingredients.push(new Ingredient());

    // TODO: focus new item input
    dispatch({
      type: 'update-recipe-form',
      data: {
        recipe: {ingredients}
      }
    });
  };
}

export function onRecipeFormIngredientDelete(ingredient) {
  return (dispatch, getState) => {
    const state = getState();
    const {ingredients} = state.recipeForm.recipe;
    const idx = ingredients.findIndex(i => i === ingredient);
    ingredients.splice(idx, 1);

    dispatch({
      type: 'update-recipe-form',
      data: {
        recipe: {ingredients}
      }
    });
  };
}

export function onRecipeFormIngredientChange(ingredient, idx) {
  return (dispatch, getState) => {
    const state = getState();
    const {ingredients} = state.recipeForm.recipe;
    ingredients.splice(idx, 1, ingredient);
    dispatch({
      type: 'update-recipe-form',
      data: {
        recipe: {ingredients}
      }
    });
  };
}

export function onRecipeFormStepAdd() {
  return (dispatch, getState) => {
    const state = getState();
    const {steps} = state.recipeForm.recipe;
    steps.push(new Step());

    // TODO: focus new item input
    dispatch({
      type: 'update-recipe-form',
      data: {
        recipe: {steps}
      }
    });
  };
}

export function onRecipeFormStepDelete(step) {
  return (dispatch, getState) => {
    const state = getState();
    const {steps} = state.recipeForm.recipe;
    const idx = steps.findIndex(i => i === step);
    steps.splice(idx, 1);

    dispatch({
      type: 'update-recipe-form',
      data: {
        recipe: {steps}
      }
    });
  };
}

export function onRecipeFormStepChange(step, idx) {
  return (dispatch, getState) => {
    const state = getState();
    const {steps} = state.recipeForm.recipe;
    steps.splice(idx, 1, step);
    dispatch({
      type: 'update-recipe-form',
      data: {
        recipe: {steps}
      }
    });
  };
}

export function onRecipeFormImageDelete() {
  return dispatch => {
    dispatch({
      type: 'update-recipe-form',
      data: {
        isImageChanged: true,
        recipe: {
          hasImage: false,
          imageSrc: null,
          imageBlob: null
        }
      }
    });
  };
}

export function onRecipeFormImageEditing() {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(openImageEditor(state.recipeForm.recipe.imageSrc));
  };
}

// TODO: move image editor actions to separate file

export function onImageEditorModalClose() {
  return dispatch => dispatch(closeImageEditor());
}

export function onImageEditorModalImageChange(imageBlob) {
  return dispatch => {
    const imageSrc = URL.createObjectURL(imageBlob);

    dispatch({
      type: 'update-recipe-form',
      data: {
        isImageChanged: true,
        recipe: {
          hasImage: true,
          imageSrc,
          imageBlob
        }
      }
    });
  };
}

export function onImageEditorModalEffectApplying() {
  return dispatch => {
    dispatch({type: 'update-image-editor', data: {isLoading: true}});
  };
}

export function onImageEditorModalEffectApplied() {
  return dispatch => {
    dispatch({type: 'update-image-editor', data: {isLoading: false}});
  };
}

function openImageEditor(imageSrc) {
  return dispatch =>
    dispatch({
      type: 'update-image-editor',
      data: {isVisible: true, imageSrc}
    });
}

function closeImageEditor() {
  return dispatch =>
    dispatch({
      type: 'update-image-editor',
      data: {isVisible: false, imageSrc: null}
    });
}
