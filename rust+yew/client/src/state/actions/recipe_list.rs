use super::{add_recipe, delete_recipe, open_recipe_modal};
use crate::api;
use crate::models::{Recipe, RecipeList, RecipeListPatch, SortDir, SortProp, StateRef};
use crate::state::reducer::Action;
use std::rc::Rc;

pub async fn load_recipes(state_ref: StateRef) {
    let state = state_ref.borrow().clone();
    state.dispatch(Action::UpdateRecipeList(
        RecipeListPatch::default()
            .is_loading(true)
            .is_first_load(false)
            .to_owned(),
    ));

    let RecipeList {
        sort_prop,
        sort_dir,
        current_page_idx,
        page_limit,
        ..
    } = *state.recipe_list;

    let page_offset = current_page_idx * page_limit;

    let recipes = api::get_recipes(sort_prop, sort_dir, page_offset, page_limit)
        .await
        .unwrap();

    state.dispatch(Action::UpdateRecipeList(
        RecipeListPatch::default()
            .items(recipes.items)
            .total(recipes.total)
            .is_loading(false)
            .to_owned(),
    ));
}

pub async fn on_recipe_list_item_click(state_ref: StateRef, recipe: Rc<Recipe>) {
    open_recipe_modal(state_ref, recipe.id).await;
}

pub async fn on_recipe_list_item_delete(state_ref: StateRef, recipe: Rc<Recipe>) {
    delete_recipe(state_ref, recipe).await;
}

pub fn on_recipe_list_add(state_ref: StateRef) {
    add_recipe(state_ref);
}

pub async fn on_recipe_list_sort(state_ref: StateRef, sort_prop: SortProp) {
    log::debug!("on_recipe_list_sort: {:?}", sort_prop);
    let state = state_ref.borrow().clone();
    let RecipeList {
        mut sort_dir,
        mut current_page_idx,
        ..
    } = *state.recipe_list;

    if sort_prop == state.recipe_list.sort_prop {
        sort_dir = sort_dir.get_opposite();
    } else {
        sort_dir = SortDir::Ascending;
        current_page_idx = 0;
    }

    state.dispatch(Action::UpdateRecipeList(
        RecipeListPatch::default()
            .sort_prop(sort_prop)
            .sort_dir(sort_dir)
            .current_page_idx(current_page_idx)
            .to_owned(),
    ));

    load_recipes(state_ref).await;
}

pub async fn on_recipe_list_page(state_ref: StateRef, page_idx: i32) {
    log::debug!("on_recipe_list_page: {:?}", page_idx);
    let state = state_ref.borrow().clone();
    state.dispatch(Action::UpdateRecipeList(
        RecipeListPatch::default()
            .current_page_idx(page_idx)
            .to_owned(),
    ));

    load_recipes(state_ref).await;
}
