import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import IconBtn from '../IconBtn';
import classes from './Modal.css';

Modal.propTypes = {
  frontClassName: PropTypes.string,
  children: PropTypes.node,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default function Modal({frontClassName, children, visible, onClose}) {
  return (
    <div className={cn(classes.root, {[classes.visible]: visible})}>
      <div className={classes.back} onClick={onClose} />
      <div className={cn(classes.front, frontClassName)}>
        {children}
        <IconBtn icon="times" className={classes.close} onClick={onClose} />
      </div>
    </div>
  );
}
