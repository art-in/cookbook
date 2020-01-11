import React, {useEffect, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import * as imageEffects from 'image-effects';

import classes from './ImageEditor.module.css';

ImageEditor.propTypes = {
  imageSrc: PropTypes.string,
  onImageChange: PropTypes.func.isRequired
};

export default function ImageEditor({imageSrc, onImageChange}) {
  const imageInput = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (imageSrc) {
        const imageEl = new Image();
        imageEl.src = imageSrc;
        await imageEl.decode();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageEl, 0, 0);
      }
    })();
  }, [imageSrc]);

  const onInputChange = useCallback(
    e => {
      const file = e.target.files[0];
      if (!file) {
        // file dialog canceled
        return;
      }
      onImageChange(file);
    },
    [onImageChange]
  );

  const onEffectButtonClick = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    console.time('imageEffect');
    const image = imageEffects.open_image(canvas, ctx);

    // TODO: more effects
    imageEffects.grayscale(image);

    imageEffects.put_image_data(canvas, ctx, image);
    console.timeEnd('imageEffect');
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.upload}>
        <input type="file" ref={imageInput} onChange={onInputChange} />
      </div>

      <div className={classes.image}>
        <canvas ref={canvasRef} />
      </div>

      <div className={classes.filters}>
        <div>Filters:</div>
        <div>
          <button onClick={onEffectButtonClick}>apply</button>
        </div>
      </div>
    </div>
  );
}
