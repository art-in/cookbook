import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import IconBtn from '../IconBtn';
import classes from './Modal.module.css';

Modal.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

function Modal({children, visible, onClose}) {
  return (
    <div className={cn(classes.root, {[classes.visible]: visible})}>
      <div className={classes.back} onClick={onClose} />
      <div className={classes.modal}>
        {children}
        <IconBtn icon="times" className={classes.close} onClick={onClose} />
      </div>
    </div>
  );
}

export default Modal;
