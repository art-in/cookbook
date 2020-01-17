import React, {useCallback} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import {
  onRecipeListAdd,
  onRecipeListPage,
  onRecipeListSort,
  onRecipeListItemClick,
  onRecipeListItemDelete
} from 'state/actions/recipe-list';
import Btn from '../shared/Btn';
import BtnGroup from '../shared/BtnGroup';
import IconBtn from '../shared/IconBtn';
import Waiter from '../shared/Waiter';
import RecipeCard from '../RecipeCard';
import RecipeFormModal from '../RecipeFormModal';
import ImageEditorModal from '../ImageEditorModal';
import classes from './RecipeList.css';

export default function RecipeList() {
  const sortProp = useSelector(state => state.recipeList.sortProp);
  const isEmpty = useSelector(state => {
    const items = state.recipeList.items;
    return !items || items.length === 0;
  });
  const items = useSelector(state => state.recipeList.items);
  const pages = useSelector(state => {
    const {total, pageLimit} = state.recipeList;
    return [...new Array(Math.ceil(total / pageLimit)).keys()];
  }, shallowEqual);
  const currentPage = useSelector(state => state.recipeList.currentPage);
  const isLoading = useSelector(state => state.recipeList.isLoading);

  const dispatch = useDispatch();

  const onAdd = useCallback(() => dispatch(onRecipeListAdd()), [dispatch]);
  const onSort = useCallback(sortProp => dispatch(onRecipeListSort(sortProp)), [
    dispatch
  ]);
  const onItemClick = useCallback(
    recipe => dispatch(onRecipeListItemClick(recipe)),
    [dispatch]
  );
  const onItemDeleteInternal = useCallback(
    (recipe, e) => {
      e.stopPropagation();
      dispatch(onRecipeListItemDelete(recipe));
    },
    [dispatch]
  );
  const onPage = useCallback(page => dispatch(onRecipeListPage(page)), [
    dispatch
  ]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <IconBtn icon="plus" width={30} title="Add recipe" onClick={onAdd} />
        <BtnGroup class="sorters">
          <Btn isActive={sortProp == 'name'} onClick={() => onSort('name')}>
            by alphabet
          </Btn>
          <Btn
            isActive={sortProp == 'complexity'}
            onClick={() => onSort('complexity')}
          >
            by complexity
          </Btn>
          <Btn
            isActive={sortProp == 'popularity'}
            onClick={() => onSort('popularity')}
          >
            by popularity
          </Btn>
        </BtnGroup>
      </div>
      <div className={classes.items}>
        {isEmpty && <div className={classes.empty}>No recipes yet</div>}
        {!isEmpty && (
          <div>
            {items.map(recipe => {
              return (
                <RecipeCard
                  className={classes.item}
                  key={recipe.id}
                  recipe={recipe}
                  isDeletable
                  onClick={() => onItemClick(recipe)}
                  onDelete={onItemDeleteInternal.bind(null, recipe)}
                />
              );
            })}
          </div>
        )}
        {isLoading && <Waiter />}
      </div>
      <div className={classes.footer}>
        <BtnGroup className={classes.pages}>
          {pages.map(page => (
            <Btn
              key={page}
              isActive={page == currentPage}
              isDisabled={page == currentPage}
              onClick={() => onPage(page)}
            >
              {page + 1}
            </Btn>
          ))}
        </BtnGroup>
      </div>
      <RecipeFormModal />
      <ImageEditorModal />
    </div>
  );
}
