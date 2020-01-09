import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';

import {
  onRecipeFormEdit,
  onRecipeFormSave,
  onRecipeFormCancel,
  onRecipeFormChange,
  onRecipeFormDelete,
  onRecipeFormIngredientAdd,
  onRecipeFormIngredientDelete,
  onRecipeFormIngredientChange,
  onRecipeFormStepAdd,
  onRecipeFormStepDelete,
  onRecipeFormStepChange,
  onRecipeFormImageEditing,
  onRecipeFormImageDelete
} from 'state/actions';
import Recipe from 'model/Recipe';
import RecipeCard from '../RecipeCard';
import IconBtn from '../shared/IconBtn';
import Waiter from '../shared/Waiter';
import List from '../shared/List';
import classes from './RecipeForm.module.css';

RecipeForm.propTypes = {
  recipe: PropTypes.instanceOf(Recipe),
  isLoading: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isDeletable: PropTypes.bool.isRequired,
  isCancelable: PropTypes.bool.isRequired
};

function RecipeForm({recipe, isLoading, isEditing, isDeletable, isCancelable}) {
  const dispatch = useDispatch();

  // TODO: do we need [dispatch]?
  const onEdit = useCallback(() => dispatch(onRecipeFormEdit()), [dispatch]);
  const onSave = useCallback(() => dispatch(onRecipeFormSave()), [dispatch]);
  const onCancel = useCallback(() => dispatch(onRecipeFormCancel()), [
    dispatch
  ]);
  const onChange = useCallback(recipe => dispatch(onRecipeFormChange(recipe)), [
    dispatch
  ]);
  const onDelete = useCallback(recipe => dispatch(onRecipeFormDelete(recipe)), [
    dispatch
  ]);
  const onIngredientAdd = useCallback(
    () => dispatch(onRecipeFormIngredientAdd()),
    [dispatch]
  );
  const onIngredientDelete = useCallback(
    ingredient => dispatch(onRecipeFormIngredientDelete(ingredient)),
    [dispatch]
  );
  const onIngredientChange = useCallback(
    (ingredient, idx, e) => {
      dispatch(
        onRecipeFormIngredientChange(
          {...ingredient, description: e.target.value},
          idx
        )
      );
    },
    [dispatch]
  );
  const onStepAdd = useCallback(() => dispatch(onRecipeFormStepAdd()), [
    dispatch
  ]);
  const onStepDelete = useCallback(() => dispatch(onRecipeFormStepDelete()), [
    dispatch
  ]);
  const onStepChange = useCallback(
    (step, idx, e) => {
      dispatch(
        onRecipeFormStepChange({...step, description: e.target.value}, idx)
      );
    },
    [dispatch]
  );
  const onImageEditing = useCallback(
    () => dispatch(onRecipeFormImageEditing()),
    [dispatch]
  );

  const onImageDelete = useCallback(() => dispatch(onRecipeFormImageDelete()), [
    dispatch
  ]);

  return (
    <div className={classes.root}>
      {recipe && (
        <RecipeCard
          recipe={recipe}
          isEditing={isEditing}
          onChange={onChange}
          onImageEditing={onImageEditing}
          onImageDelete={onImageDelete}
        />
      )}

      {recipe && (
        <List
          title="Ingredients:"
          items={recipe.ingredients}
          isEditing={isEditing}
          className={classes.ingredients}
          onItemAdd={onIngredientAdd}
          onItemDelete={onIngredientDelete}
        >
          {(ingredient, idx) => (
            <input
              value={ingredient.description}
              readOnly={!isEditing}
              className={classes.ingredient}
              onChange={onIngredientChange.bind(null, ingredient, idx)}
            />
          )}
        </List>
      )}

      {recipe && (
        <List
          title="Steps:"
          items={recipe.steps}
          isEditing={isEditing}
          isOrdered
          className={classes.steps}
          onItemAdd={onStepAdd}
          onItemDelete={onStepDelete}
        >
          {(step, idx) => (
            <input
              value={step.description}
              readOnly={!isEditing}
              className={classes.step}
              onChange={onStepChange.bind(null, step, idx)}
            />
          )}
        </List>
      )}

      <div className={classes.actions}>
        {!isEditing && (
          <IconBtn
            icon="pencil"
            title="Edit"
            className={classes.action}
            onClick={() => onEdit()}
          />
        )}
        {isEditing && (
          <IconBtn
            icon="save"
            title="Save"
            className={classes.action}
            onClick={() => onSave()}
          />
        )}
        {isCancelable && isEditing && (
          <IconBtn
            icon="eraser"
            title="Cancel"
            className={classes.action}
            onClick={() => onCancel()}
          />
        )}
        {isDeletable && (
          <IconBtn
            icon="trash"
            title="Delete"
            className={classes.action}
            onClick={() => onDelete(recipe)}
          />
        )}
      </div>
      {isLoading && <Waiter />}
    </div>
  );
}

export default RecipeForm;
