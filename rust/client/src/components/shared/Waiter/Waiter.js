import React, {memo} from 'react';

import Icon from '../Icon';
import classes from './Waiter.css';

function Waiter() {
  return (
    <div className={classes.root}>
      <div className={classes.back} />
      <Icon icon="spinner" width={30} className={classes.spinner} />
    </div>
  );
}

export default memo(Waiter);
