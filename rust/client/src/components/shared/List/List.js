import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import IconBtn from '../IconBtn';
import classes from './List.css';

List.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  items: PropTypes.array,
  isOrdered: PropTypes.bool,
  isEditing: PropTypes.bool,
  children: PropTypes.func.isRequired,

  onItemAdd: PropTypes.func,
  onItemDelete: PropTypes.func
};

export default function List({
  className,
  title,
  items,
  isOrdered,
  isEditing,
  children,
  onItemAdd,
  onItemDelete
}) {
  const renderItem = children;
  return (
    <div className={cn(classes.root, className)}>
      <span className={classes.title}>{title}</span>
      {isEditing && (
        <IconBtn className={classes.add} icon="plus" onClick={onItemAdd} />
      )}
      <ul className={cn({[classes.ordered]: isOrdered})}>
        {items.map((item, idx) => (
          <li key={idx} className={classes.item}>
            {renderItem(item, idx)}
            {isEditing && (
              <IconBtn
                className={classes.delete}
                icon="trash"
                onClick={() => onItemDelete(item)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
