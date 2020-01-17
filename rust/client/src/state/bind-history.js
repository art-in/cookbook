import {createBrowserHistory} from 'history';
import qs from 'query-string';

import clone from 'utils/clone';
import {onHistoryUpdate, onStoreUpdate} from './actions/history';
import st from './state';

const initialState = clone(st);

const history = createBrowserHistory();

export default function bindHistory(store) {
  store.subscribe(() =>
    // schedule hander to next task so it will run after all recursive
    // dispatches of current task (eg. onHistoryUpdate can dispatch several
    // actions on initial load, when both recipe list and modal state should
    // be updated)
    setTimeout(() => store.dispatch(onStoreUpdate(history)))
  );

  history.listen(location => store.dispatch(onHistoryUpdate(location)));

  return history;
}

export function getHistoryState(location) {
  const query = qs.parse(location.search);

  return {
    recipeId: query.rid === undefined ? undefined : Number(query.rid),
    sortProp: query.sp || initialState.recipeList.sortProp,
    sortDir: query.sd || initialState.recipeList.sortDir,
    currentPage:
      query.p !== undefined
        ? Number(query.p) - 1
        : initialState.recipeList.currentPage,
    isRecipeEditing: query.edit === null || initialState.recipeForm.isEditing,
    isRecipeImageEditing:
      query.image === null || initialState.imageEditor.isVisible
  };
}

export function setHistoryState(history, historyState) {
  const query = {};

  if (historyState.recipeId !== undefined) {
    query.rid = historyState.recipeId;
  }

  if (historyState.sortProp !== initialState.recipeList.sortProp) {
    query.sp = historyState.sortProp;
  }

  if (historyState.sortDir !== initialState.recipeList.sortDir) {
    query.sd = historyState.sortDir;
  }

  if (historyState.currentPage !== initialState.recipeList.currentPage) {
    query.p = historyState.currentPage + 1;
  }

  if (historyState.isRecipeEditing !== initialState.recipeForm.isEditing) {
    query.edit = null;
  }

  if (
    historyState.isRecipeImageEditing !== initialState.imageEditor.isVisible
  ) {
    query.image = null;
  }

  let search = qs.stringify(query);
  search = search ? '?' + search : '';

  if (history.location.search !== search) {
    history.push(search);
  }
}
