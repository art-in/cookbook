import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  onImageEditorModalClose,
  onImageEditorModalImageChange,
  onImageEditorModalEffectApplying,
  onImageEditorModalEffectApplied
} from 'state/actions';
import Modal from '../shared/Modal';
import ImageEditor from '../ImageEditor';

export default function ImageEditorModal() {
  const dispatch = useDispatch();

  const isVisible = useSelector(state => state.imageEditor.isVisible);
  const imageSrc = useSelector(state => state.imageEditor.imageSrc);
  const isLoading = useSelector(state => state.imageEditor.isLoading);

  const onClose = useCallback(() => {
    // TODO: allow to cancel image processing by closing modal. until then
    // it is goint to be a blocking operation.
    if (!isLoading) {
      dispatch(onImageEditorModalClose());
    }
  }, [dispatch, isLoading]);

  const onImageChange = useCallback(
    blob => dispatch(onImageEditorModalImageChange(blob)),
    [dispatch]
  );

  // TODO: rename to onImageProcessing
  const onEffectApplying = useCallback(
    () => dispatch(onImageEditorModalEffectApplying()),
    [dispatch]
  );

  const onEffectApplied = useCallback(
    () => dispatch(onImageEditorModalEffectApplied()),
    [dispatch]
  );

  return (
    <Modal visible={isVisible} onClose={() => onClose()}>
      {/* remount editor to reset file input */}
      {isVisible && (
        <ImageEditor
          imageSrc={imageSrc}
          isLoading={isLoading}
          onImageChange={onImageChange}
          onEffectApplying={onEffectApplying}
          onEffectApplied={onEffectApplied}
        />
      )}
    </Modal>
  );
}
