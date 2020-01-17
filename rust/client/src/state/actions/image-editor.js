import Recipe from 'model/Recipe';

export function openImageEditor(imageSrc) {
  return dispatch =>
    dispatch({
      type: 'update-image-editor',
      data: {isVisible: true, imageSrc}
    });
}

export function closeImageEditor() {
  return dispatch =>
    dispatch({
      type: 'update-image-editor',
      data: {isVisible: false, imageSrc: null}
    });
}

export function onImageEditorModalClose() {
  return dispatch => dispatch(closeImageEditor());
}

export function onImageEditorModalImageChange(imageBlob) {
  return (dispatch, getState) => {
    const state = getState();
    const recipe = state.recipeForm.recipe;

    const imageSrc = URL.createObjectURL(imageBlob);

    dispatch({
      type: 'update-recipe-form',
      data: {
        isImageChanged: true,
        recipe: new Recipe({
          ...recipe,
          hasImage: true,
          imageSrc,
          imageBlob
        })
      }
    });
  };
}

export function onImageEditorModalImageProcessing() {
  return dispatch => {
    dispatch({type: 'update-image-editor', data: {isProcessing: true}});
  };
}

export function onImageEditorModalImageProcessed() {
  return dispatch => {
    dispatch({type: 'update-image-editor', data: {isProcessing: false}});
  };
}
