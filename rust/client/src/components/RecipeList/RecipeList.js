import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  onRecipeListAdd,
  onRecipeListPage,
  onRecipeListSort,
  onRecipeListItemClick,
  onRecipeListItemDelete
} from 'state/actions';
import Btn from '../shared/Btn';
import BtnGroup from '../shared/BtnGroup';
import IconBtn from '../shared/IconBtn';
import Waiter from '../shared/Waiter';
import RecipeCard from '../RecipeCard';
import RecipeFormModal from '../RecipeFormModal';
import classes from './RecipeList.module.css';

function RecipeList() {
  // selectors
  const sortProp = useSelector(state => state.recipes.sortProp);
  const isEmpty = useSelector(state => {
    const items = state.recipes.items;
    return !items || items.length === 0;
  });
  const items = useSelector(state => state.recipes.items);
  const pages = useSelector(state => {
    // TODO: move to helper function
    const {total, pageLimit} = state.recipes;
    const res = [];
    for (let i = 0; i < Math.ceil(total / pageLimit); i++) {
      res.push(i);
    }
    return res;
  });
  const currentPage = useSelector(state => state.recipes.currentPage);
  const isLoading = useSelector(state => state.recipes.isLoading);
  const isModalVisible = useSelector(state => state.modal.isVisible);

  // even handlers
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
        <IconBtn
          icon="plus"
          width={30} // TODO: add predefined sizes
          title="Add recipe"
          onClick={() => onAdd()}
        />
        <BtnGroup class="sorters">
          <Btn active={sortProp == 'name'} onClick={() => onSort('name')}>
            by alphabet
          </Btn>
          <Btn
            active={sortProp == 'complexity'}
            onClick={() => onSort('complexity')}
          >
            by complexity
          </Btn>
          <Btn
            active={sortProp == 'popularity'}
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
              active={page == currentPage}
              disabled={page == currentPage}
              onClick={() => onPage(page)}
            >
              {page + 1}
            </Btn>
          ))}
        </BtnGroup>
      </div>
      <RecipeFormModal visible={isModalVisible} />
    </div>
  );
}

export default RecipeList;
