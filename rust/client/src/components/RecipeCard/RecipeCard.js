import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Recipe from 'model/Recipe';
import Icon from '../shared/Icon';
import IconBtn from '../shared/IconBtn';
import classes from './RecipeCard.module.css';

RecipeCard.propTypes = {
  className: PropTypes.string,
  recipe: PropTypes.instanceOf(Recipe).isRequired,
  isEditing: PropTypes.bool,
  isDeletable: PropTypes.bool,

  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onImageEditing: PropTypes.func,
  onImageDelete: PropTypes.func
};

// TODO: export default ...
function RecipeCard({
  className,
  recipe,
  isEditing,
  isDeletable,
  onClick,
  onChange,
  onDelete,
  onImageEditing,
  onImageDelete
}) {
  const onNameChange = useCallback(
    e => onChange({...recipe, name: e.target.value}),
    [onChange, recipe]
  );

  const onDescriptionChange = useCallback(
    e => onChange({...recipe, description: e.target.value}),
    [onChange, recipe]
  );

  const onComplexityChange = useCallback(
    e => onChange({...recipe, complexity: Number(e.target.value)}),
    [onChange, recipe]
  );

  const onPopularityChange = useCallback(
    e => onChange({...recipe, popularity: Number(e.target.value)}),
    [onChange, recipe]
  );

  const onImageClick = useCallback(() => {
    if (isEditing) {
      onImageEditing();
    }
  }, [isEditing, onImageEditing]);

  const onImageDeleteInternal = useCallback(
    e => {
      e.stopPropagation();
      onImageDelete();
    },
    [onImageDelete]
  );

  return (
    <div
      className={cn(classes.root, className, {[classes.editing]: isEditing})}
      onClick={onClick}
    >
      {isDeletable && (
        <div className={classes.actions}>
          <IconBtn
            className={classes.action}
            icon="trash"
            title="Delete recipe"
            onClick={onDelete}
          />
        </div>
      )}
      <div
        className={cn(classes['image-container'], {
          [classes.empty]: !recipe.hasImage
        })}
        title={isEditing ? 'Edit image' : null}
        onClick={onImageClick}
      >
        {recipe.hasImage && <img src={recipe.imageSrc} alt={recipe.name} />}
        {!recipe.hasImage && (
          <div className={classes['image-stub']}>
            {isEditing ? '(click to set image)' : '(no image yet)'}
          </div>
        )}
        {isEditing && recipe.hasImage && (
          <IconBtn
            className={classes.delete}
            icon="trash"
            title="Delete image"
            onClick={onImageDeleteInternal}
          />
        )}
      </div>
      <div className={classes.props}>
        <input
          value={recipe.name}
          readOnly={!isEditing}
          placeholder="Recipe name"
          className={classes.name}
          onChange={onNameChange}
        />

        <textarea
          value={recipe.description}
          readOnly={!isEditing}
          placeholder="Description"
          className={classes.description}
          onChange={onDescriptionChange}
        />

        <div className={classes.numbers}>
          <span className={classes.complexity} title="Complexity">
            <Icon icon="clock" />
            <input
              value={recipe.complexity}
              readOnly={!isEditing}
              type="number"
              min="1"
              max="10"
              onChange={onComplexityChange}
            />
          </span>
          <span className={classes.popularity} title="Popularity">
            <Icon icon="smile" />
            <input
              value={recipe.popularity}
              readOnly={!isEditing}
              type="number"
              min="1"
              max="10"
              onChange={onPopularityChange}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
