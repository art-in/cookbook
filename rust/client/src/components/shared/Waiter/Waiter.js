import React from 'react';

import Icon from '../Icon';
import classes from './Waiter.module.css';

function Waiter() {
  return (
    <div className={classes.root}>
      <div className={classes.back} />
      <Icon
        icon="spinner"
        width={30} // TODO: add size enum
        className={classes.spinner}
      />
    </div>
  );
}

export default Waiter;
