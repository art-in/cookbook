import React, {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {onRecipeFormModalClose} from 'state/actions';
import RecipeForm from '../RecipeForm';
import Modal from '../shared/Modal';

function RecipeFormModal() {
  // TODO: move state connection logic down to RecipeForm or up to
  // RecipeFormModal, so it's not scattered between both
  const dispatch = useDispatch();

  const isVisible = useSelector(state => state.recipeForm.isVisible);
  const recipe = useSelector(state => state.recipeForm.recipe);
  const isLoading = useSelector(state => state.recipeForm.isLoading);
  const isEditing = useSelector(state => state.recipeForm.isEditing);
  const isDeletable = useSelector(state => state.recipeForm.isDeletable);
  const isCancelable = useSelector(state => state.recipeForm.isCancelable);
  const onClose = useCallback(() => dispatch(onRecipeFormModalClose()), [
    dispatch
  ]);

  return (
    <Modal visible={isVisible} onClose={() => onClose()}>
      <RecipeForm
        recipe={recipe}
        isLoading={isLoading}
        isEditing={isEditing}
        isDeletable={isDeletable}
        isCancelable={isCancelable}
      />
    </Modal>
  );
}

export default RecipeFormModal;
