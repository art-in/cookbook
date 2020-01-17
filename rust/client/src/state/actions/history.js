import {getHistoryState, setHistoryState} from '../bind-history';
import {
  openRecipeModal,
  closeRecipeModal,
  onRecipeFormEdit,
  onRecipeFormCancel,
  onRecipeFormImageEditing
} from './recipe-form';
import {loadRecipes} from './recipe-list';
import {onImageEditorModalClose} from './image-editor';

// maps history to store
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

// maps store to history
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
