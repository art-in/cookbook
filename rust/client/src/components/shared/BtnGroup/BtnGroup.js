import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import classes from './BtnGroup.css';

BtnGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
};

export default function BtnGroup({children}) {
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
