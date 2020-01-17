import React, {memo} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import classes from './Btn.css';

Btn.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func
};

function Btn({children, className, isActive, isDisabled, onClick}) {
  return (
    <button
      className={cn(classes.root, className, {[classes.active]: isActive})}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default memo(Btn);
