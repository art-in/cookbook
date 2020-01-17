import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

import reducer from './reducer';
import initialState from './state';

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(
    createLogger({
      collapsed: true,
      timestamp: false
    })
  );
}

export default function() {
  return createStore(reducer, initialState, applyMiddleware(...middlewares));
}
