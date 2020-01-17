import {onHistoryUpdate} from './history';

export function onInit(location) {
  return dispatch => dispatch(onHistoryUpdate(location));
}
