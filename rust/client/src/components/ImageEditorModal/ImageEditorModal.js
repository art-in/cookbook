import React, {useCallback, memo} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {onImageEditorModalClose} from 'state/actions/image-editor';
import Modal from '../shared/Modal';
import ImageEditor from '../ImageEditor';
import classes from './ImageEditorModal.css';

function ImageEditorModal() {
  const dispatch = useDispatch();

  const isVisible = useSelector(state => state.imageEditor.isVisible);
  const isProcessing = useSelector(state => state.imageEditor.isProcessing);

  const onClose = useCallback(() => {
    // TODO: allow to cancel image processing by closing modal. until then
    // it is goint to be a blocking operation.
    if (!isProcessing) {
      dispatch(onImageEditorModalClose());
    }
  }, [dispatch, isProcessing]);

  return (
    <Modal frontClassName={classes.front} visible={isVisible} onClose={onClose}>
      {/* remount editor when it becomes visible to reset file input */}
      {isVisible && <ImageEditor />}
    </Modal>
  );
}

export default memo(ImageEditorModal);
