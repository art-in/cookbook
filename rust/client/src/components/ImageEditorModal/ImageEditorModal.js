import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  onImageEditorModalClose,
  onImageEditorModalImageChange
} from 'state/actions';
import Modal from '../shared/Modal';
import ImageEditor from '../ImageEditor';

export default function ImageEditorModal() {
  const dispatch = useDispatch();

  const isVisible = useSelector(state => state.imageEditor.isVisible);
  const imageSrc = useSelector(state => state.imageEditor.imageSrc);

  const onClose = useCallback(() => dispatch(onImageEditorModalClose()), [
    dispatch
  ]);

  const onImageChange = useCallback(
    file => dispatch(onImageEditorModalImageChange(file)),
    [dispatch]
  );

  return (
    <Modal visible={isVisible} onClose={() => onClose()}>
      {/* remount editor to reset file input */}
      {isVisible && (
        <ImageEditor imageSrc={imageSrc} onImageChange={onImageChange} />
      )}
    </Modal>
  );
}
