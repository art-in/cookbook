import deepUpdate from '../utils/deep-update';

export default function reducer(state, action) {
  switch (action.type) {
    case 'update-recipe-list':
      deepUpdate(state.recipes, action.data);
      break;
    case 'update-recipe-form-modal':
      deepUpdate(state.modal, action.data);
      break;
  }
  return state;
}
