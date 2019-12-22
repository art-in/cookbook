import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import classes from './BtnGroup.module.css';

BtnGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
};

function BtnGroup({children}) {
  return (
    <span className={classes.root}>
      {children.map((child, idx) =>
        React.cloneElement(child, {
          key: idx,
          className: cn(child.props.className, classes.item)
        })
      )}
    </span>
  );
}

export default BtnGroup;
