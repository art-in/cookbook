import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import classes from './Btn.module.css';

Btn.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  active: PropTypes.bool, // TODO: isActive
  disabled: PropTypes.bool,
  onClick: PropTypes.func // TODO: .isRequired
};

function Btn({children, className, active, disabled, onClick}) {
  return (
    <button
      className={cn(classes.root, className, {[classes.active]: active})}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Btn;
