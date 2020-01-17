import clone from 'utils/clone';
import * as api from 'api';
import Ingredient from 'model/Ingredient';
import Step from 'model/Step';
import {loadRecipes} from './recipe-list';
import {openImageEditor} from './image-editor';
import Recipe from 'model/Recipe';

// TODO: handle API request failures

export function openRecipeModal(recipeId) {
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

export function closeRecipeModal() {
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

export function onRecipeFormModalClose() {
  return dispatch => dispatch(closeRecipeModal());
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
  return dispatch =>
    dispatch({type: 'update-recipe-form', data: {recipe: new Recipe(recipe)}});
}

export function onRecipeFormDelete() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(deleteRecipe(state.recipeForm.recipe));
  };
}

export function onRecipeFormIngredientAdd() {
  return (dispatch, getState) => {
    const state = getState();
    const {ingredients} = state.recipeForm.recipe;

    // TODO: focus new item input
    dispatch({
      type: 'update-recipe-form',
      data: {
        recipe: {ingredients: [...ingredients, new Ingredient()]}
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
        recipe: {ingredients: [...ingredients]}
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
        recipe: {ingredients: [...ingredients]}
      }
    });
  };
}

export function onRecipeFormStepAdd() {
  return (dispatch, getState) => {
    const state = getState();
    const {steps} = state.recipeForm.recipe;

    // TODO: focus new item input
    dispatch({
      type: 'update-recipe-form',
      data: {
        recipe: {steps: [...steps, new Step()]}
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
        recipe: {steps: [...steps]}
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
        recipe: {steps: [...steps]}
      }
    });
  };
}

export function onRecipeFormImageDelete() {
  return (dispatch, getState) => {
    const state = getState();
    const recipe = state.recipeForm.recipe;

    dispatch({
      type: 'update-recipe-form',
      data: {
        isImageChanged: true,
        recipe: new Recipe({
          ...recipe,
          hasImage: false,
          imageSrc: null,
          imageBlob: null
        })
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
