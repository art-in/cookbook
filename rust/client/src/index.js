import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './components/App';
import createStore from './state/create-store';
import {loadRecipes} from './state/actions';

const store = createStore();

store.dispatch(loadRecipes());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
