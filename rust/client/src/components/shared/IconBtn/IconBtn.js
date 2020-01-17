import React, {memo} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Icon from '../Icon';
import classes from './IconBtn.css';

IconBtn.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.number,
  onClick: PropTypes.func.isRequired
};

function IconBtn({className, icon, title, width, onClick}) {
  return (
    <Icon
      className={cn(classes.root, className)}
      icon={icon}
      title={title}
      width={width}
      onClick={onClick}
    />
  );
}

export default memo(IconBtn);
