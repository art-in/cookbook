import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

import reducer from './reducer';
import initialState from './state';

const logger = createLogger({
  collapsed: true,
  timestamp: false
});

export default function() {
  return createStore(reducer, initialState, applyMiddleware(thunk, logger));
}
