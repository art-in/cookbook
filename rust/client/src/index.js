import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import createStore from 'state/create-store';
import bindHistory from 'state/bind-history';
import {onInit} from 'state/actions/init';
import App from 'components/App';

const store = createStore();
const history = bindHistory(store);

store.dispatch(onInit(history.location));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
