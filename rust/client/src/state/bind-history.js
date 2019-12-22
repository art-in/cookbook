import {createBrowserHistory} from 'history';
import qs from 'query-string';

import clone from 'utils/clone';
import {onHistoryUpdate, onStoreUpdate} from './actions';
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
    sortProp: query.sp || initialState.recipes.sortProp,
    sortDir: query.sd || initialState.recipes.sortDir,
    currentPage:
      query.p !== undefined
        ? Number(query.p) - 1
        : initialState.recipes.currentPage
  };
}

export function setHistoryState(history, historyState) {
  const query = {};

  // TODO: modal.?recipes syntax ?
  if (historyState.recipeId !== undefined) {
    query.rid = historyState.recipeId;
  }

  if (historyState.sortProp !== initialState.recipes.sortProp) {
    query.sp = historyState.sortProp;
  }

  if (historyState.sortDir !== initialState.recipes.sortDir) {
    query.sd = historyState.sortDir;
  }

  if (historyState.currentPage !== initialState.recipes.currentPage) {
    query.p = historyState.currentPage + 1;
  }

  let search = qs.stringify(query);
  search = search ? '?' + search : '';

  if (history.location.search !== search) {
    history.push(search);
  }
}
