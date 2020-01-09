import React, {useRef, useCallback} from 'react';
import PropTypes from 'prop-types';

import classes from './ImageEditor.module.css';

ImageEditor.propTypes = {
  imageSrc: PropTypes.string,
  onImageChange: PropTypes.func.isRequired
};

export default function ImageEditor({imageSrc, onImageChange}) {
  const imageInput = useRef(null);

  const onImageChangeInternal = useCallback(
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

  return (
    <div className={classes.root}>
      <div className={classes.upload}>
        <input type="file" ref={imageInput} onChange={onImageChangeInternal} />
      </div>

      <div className={classes.image}>{imageSrc && <img src={imageSrc} />}</div>

      <div className={classes.filters}>
        <div>Filters: TBD</div>
      </div>
    </div>
  );
}
