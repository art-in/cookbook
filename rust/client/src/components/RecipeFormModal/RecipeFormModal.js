import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';

import {onRecipeFormModalClose} from 'state/actions';
import RecipeForm from '../RecipeForm';
import Modal from '../shared/Modal';

RecipeFormModal.propTypes = {
  visible: PropTypes.bool.isRequired
};

function RecipeFormModal({visible}) {
  const dispatch = useDispatch();

  const recipe = useSelector(state => state.modal.recipe);
  const isLoading = useSelector(state => state.modal.isLoading);
  const isEditing = useSelector(state => state.modal.isEditing);
  const isDeletable = useSelector(state => state.modal.isDeletable);
  const isCancelable = useSelector(state => state.modal.isCancelable);
  const onClose = useCallback(() => dispatch(onRecipeFormModalClose()), [
    dispatch
  ]);

  return (
    <Modal visible={visible} onClose={() => onClose()}>
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
