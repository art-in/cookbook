import deepUpdate from '../utils/deep-update';

export default function reducer(state, action) {
  switch (action.type) {
    case 'update-recipe-list':
      deepUpdate(state.recipeList, action.data);
      break;
    case 'update-recipe-form':
      deepUpdate(state.recipeForm, action.data);
      break;
    case 'update-image-editor':
      deepUpdate(state.imageEditor, action.data);
      break;
  }
  return state;
}
