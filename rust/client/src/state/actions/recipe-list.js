import clone from 'utils/clone';
import * as api from 'api';
import Recipe from 'model/Recipe';
import st from '../state';
import {openRecipeModal, deleteRecipe} from './recipe-form';

const initialState = clone(st);

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

export function onRecipeListItemDelete(recipe) {
  return dispatch => dispatch(deleteRecipe(recipe));
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

export function onRecipeListPage(pageNumber) {
  return dispatch => {
    dispatch({type: 'update-recipe-list', data: {currentPage: pageNumber}});
    dispatch(loadRecipes());
  };
}
