import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import * as imageEffects from 'image-effects';

import createStore from 'state/create-store';
import bindHistory from 'state/bind-history';
import {onInit} from 'state/actions';
import App from 'components/App';

// set hook to show pretty rust panics in browser console
imageEffects.set_panic_hook();

const store = createStore();
const history = bindHistory(store);

store.dispatch(onInit(history.location));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
