import React, {useCallback, memo} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {onRecipeFormModalClose} from 'state/actions/recipe-form';
import RecipeForm from '../RecipeForm';
import Modal from '../shared/Modal';

function RecipeFormModal() {
  const dispatch = useDispatch();

  const isVisible = useSelector(state => state.recipeForm.isVisible);
  const onClose = useCallback(() => dispatch(onRecipeFormModalClose()), [
    dispatch
  ]);

  return (
    <Modal visible={isVisible} onClose={onClose}>
      <RecipeForm />
    </Modal>
  );
}

export default memo(RecipeFormModal);
