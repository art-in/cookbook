import React, {useEffect, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  onImageEditorModalImageChange,
  onImageEditorModalImageProcessing,
  onImageEditorModalImageProcessed
} from 'state/actions/image-editor';
import getImageBlob from 'utils/get-image-blob-from-canvas';
import Waiter from '../shared/Waiter';
import classes from './ImageEditor.css';

const imageEffectsWorker = new Worker('utils/image-effects-worker-bootstrap', {
  name: 'image-effects',
  type: 'module'
});

export default function ImageEditor() {
  const dispatch = useDispatch();

  const imageInput = useRef(null);
  const canvasRef = useRef(null);

  const imageSrc = useSelector(state => state.imageEditor.imageSrc);
  const isProcessing = useSelector(state => state.imageEditor.isProcessing);

  async function renderImage(canvas, imageSrc) {
    const imageEl = new Image();
    imageEl.src = imageSrc;
    await imageEl.decode();

    // set canvas height to preserve sides ratio of source image
    const imageRatio = imageEl.naturalWidth / imageEl.naturalHeight;
    const canvasHeight = canvas.width / imageRatio;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageEl, 0, 0, canvas.width, canvasHeight);
  }

  function renderArrayBuffer(canvas, arrayBuffer) {
    const array = new Uint8ClampedArray(arrayBuffer);
    const imageData = new ImageData(array, canvas.width, canvas.height);

    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
  }

  const onImageChange = useCallback(
    blob => dispatch(onImageEditorModalImageChange(blob)),
    [dispatch]
  );

  const onImageProcessing = useCallback(
    () => dispatch(onImageEditorModalImageProcessing()),
    [dispatch]
  );

  const onImageProcessed = useCallback(
    () => dispatch(onImageEditorModalImageProcessed()),
    [dispatch]
  );

  const onInputChange = useCallback(
    async e => {
      const file = e.target.files[0];
      if (!file) {
        // file dialog canceled
        return;
      }

      // TODO: image is not reset when selecting same input file
      const canvas = canvasRef.current;
      const imageSrc = URL.createObjectURL(file);
      await renderImage(canvas, imageSrc);

      onImageChange(getImageBlob(canvas));
    },
    [onImageChange]
  );

  const onEffectButtonClick = useCallback(
    e => {
      const effectType = e.target.dataset.effect;

      onImageProcessing();

      // pass canvas image for processing into worker thread.
      // TODO: better use OffscreenCanvas. not using it right now as it is still
      // experimental. even though we transfering image buffer to worker with
      // zero-cost, we still need to `getImageData` which clones underlying
      // canvas buffer. OffscreenCanvas allows to grab its buffer without
      // cloning.
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const imageArrayBuffer = imageData.data.buffer;

      imageEffectsWorker.postMessage(
        {
          effectType,
          image: {
            buffer: imageArrayBuffer,
            width: canvas.width,
            height: canvas.height
          }
        },
        [imageArrayBuffer]
      );
    },
    [onImageProcessing]
  );

  const onImageEffectsWorkerMessage = useCallback(
    e => {
      switch (e.data.resultCode) {
        case 'success': {
          const canvas = canvasRef.current;
          renderArrayBuffer(canvas, e.data.image.buffer);

          onImageChange(getImageBlob(canvas));
          break;
        }
        case 'fail':
          alert(
            `Failed to apply ${e.data.effectType} effect: \n ${e.data.error}`
          );
          break;
        default:
          throw Error(`Unknown result code '${e.data.resultCode}'`);
      }

      onImageProcessed();
    },
    [onImageProcessed, onImageChange]
  );

  // on mount
  useEffect(() => {
    if (imageSrc) {
      renderImage(canvasRef.current, imageSrc);
    }

    imageEffectsWorker.addEventListener('message', onImageEffectsWorkerMessage);

    return () => {
      imageEffectsWorker.removeEventListener(
        'message',
        onImageEffectsWorkerMessage
      );
    };
  }, [imageSrc, onImageEffectsWorkerMessage]);

  return (
    <div className={classes.root}>
      <div className={classes.upload}>
        <input type="file" ref={imageInput} onChange={onInputChange} />
      </div>

      <div className={classes.image}>
        <canvas ref={canvasRef} width={600} />
      </div>

      <div className={classes.effects}>
        <button onClick={onEffectButtonClick} data-effect="grayscale">
          grayscale
        </button>
        <button onClick={onEffectButtonClick} data-effect="solarize">
          solarize
        </button>
        <button onClick={onEffectButtonClick} data-effect="halftone">
          halftone
        </button>
        <button onClick={onEffectButtonClick} data-effect="primary">
          primary
        </button>
        <button onClick={onEffectButtonClick} data-effect="colorize">
          colorize
        </button>
        <button onClick={onEffectButtonClick} data-effect="sepia">
          sepia
        </button>
      </div>

      {isProcessing && <Waiter />}
    </div>
  );
}
