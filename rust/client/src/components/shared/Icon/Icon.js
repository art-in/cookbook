import React, {memo} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import classes from './Icon.css';

import {ReactComponent as ClockIcon} from './images/clock-solid.svg';
import {ReactComponent as EraserIcon} from './images/eraser-solid.svg';
import {ReactComponent as PencilIcon} from './images/pencil-alt-solid.svg';
import {ReactComponent as PlusIcon} from './images/plus-circle-solid.svg';
import {ReactComponent as SaveIcon} from './images/save-solid.svg';
import {ReactComponent as SmileIcon} from './images/smile-solid.svg';
import {ReactComponent as SpinnerIcon} from './images/spinner-solid.svg';
import {ReactComponent as TimesIcon} from './images/times-solid.svg';
import {ReactComponent as TrashIcon} from './images/trash-alt-solid.svg';

Icon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.number,
  onClick: PropTypes.func
};

Icon.defaultProps = {
  width: 20
};

function Icon({className, icon, title, width, onClick}) {
  const props = {
    className,
    title,
    width,
    onClick,
    style: {verticalAlign: 'sub'}
  };

  switch (icon) {
    case 'clock':
      return <ClockIcon {...props} />;
    case 'eraser':
      return <EraserIcon {...props} />;
    case 'pencil':
      return <PencilIcon {...props} />;
    case 'plus':
      return <PlusIcon {...props} />;
    case 'save':
      return <SaveIcon {...props} />;
    case 'smile':
      return <SmileIcon {...props} />;
    case 'spinner':
      return (
        <SpinnerIcon
          {...props}
          className={cn(props.className, classes.spinner)}
        />
      );
    case 'times':
      return <TimesIcon {...props} />;
    case 'trash':
      return <TrashIcon {...props} />;

    default:
      throw Error(`Unknown icon type: '${icon}'`);
  }
}

export default memo(Icon);
