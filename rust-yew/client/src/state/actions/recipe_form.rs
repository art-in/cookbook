use super::load_recipes;
use crate::api;
use crate::models::{
    Ingredient, Recipe, RecipeForm, RecipeFormPatch, RecipeList, RecipeListPatch, RecipePatch,
    StateRef, Step,
};
use crate::state::reducer::Action;
use gloo_dialogs::confirm;
use std::rc::Rc;

pub async fn open_recipe_modal(state_ref: StateRef, recipe: Rc<Recipe>) {
    let state = state_ref.borrow().clone();
    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default()
            .is_visible(true)
            .is_loading(true)
            .is_editing(false)
            .is_editable(false)
            .is_deletable(false)
            .is_cancelable(false)
            .recipe(None)
            .recipe_id(Some(recipe.id))
            .is_image_changed(false)
            .to_owned(),
    ));

    // TODO: handle API request failures
    let recipe = api::get_recipe(recipe.id).await.unwrap();

    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default()
            .recipe(Some(Rc::new(recipe)))
            .is_loading(false)
            .is_editable(true)
            .is_deletable(true)
            .is_cancelable(true)
            .is_new_recipe(false)
            .to_owned(),
    ));
}

pub fn close_recipe_form_modal(state_ref: StateRef) {
    let state = state_ref.borrow().clone();
    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default()
            .is_visible(false)
            .is_loading(false)
            .recipe_id(None)
            .recipe(None)
            .is_editing(false)
            .to_owned(),
    ));
}

pub fn add_recipe(state_ref: StateRef) {
    let state = state_ref.borrow().clone();
    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default()
            .recipe(Some(Rc::new(Recipe::default())))
            .is_loading(false)
            .is_editing(true)
            .is_editable(true)
            .is_deletable(false)
            .is_cancelable(false)
            .is_new_recipe(true)
            .is_visible(true)
            .to_owned(),
    ));
}

pub async fn delete_recipe(state_ref: StateRef, recipe: Rc<Recipe>) {
    if confirm(&format!("Delete recipe \"{}\"?", recipe.name)) {
        let state = state_ref.borrow().clone();

        close_recipe_form_modal(state_ref.clone());
        state.dispatch(Action::UpdateRecipeList(
            RecipeListPatch::default().is_loading(true).to_owned(),
        ));

        api::delete_recipe(recipe.id).await.unwrap();

        let RecipeList {
            current_page_idx,
            items,
            ..
        } = state.recipe_list.as_ref();

        if current_page_idx != &0 && items.len() == 1 {
            // jump to prev page if deleting last item on current page
            state.dispatch(Action::UpdateRecipeList(
                RecipeListPatch::default()
                    .current_page_idx(current_page_idx - 1)
                    .to_owned(),
            ));
        }

        load_recipes(state_ref).await;
    }
}

pub fn on_recipe_form_modal_close(state_ref: StateRef) {
    close_recipe_form_modal(state_ref);
}

pub fn on_recipe_form_edit(state_ref: StateRef) {
    log::debug!("on_recipe_form_edit");
    let state = state_ref.borrow().clone();
    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default()
            .is_editing(true)
            .prev_recipe(state.recipe_form.recipe.clone())
            .to_owned(),
    ));
}

pub async fn on_recipe_form_save(state_ref: StateRef) {
    // TODO: validate inputs
    // TODO: skip PUT recipe if no changes
    log::debug!("on_recipe_form_save");
    let state = state_ref.borrow().clone();

    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default().is_loading(true).to_owned(),
    ));
    let RecipeForm { recipe, .. } = state.recipe_form.as_ref();
    let recipe = recipe.as_ref().expect("No recipe on form");

    if state.recipe_form.is_new_recipe {
        api::post_recipe(&*recipe).await.unwrap();
        close_recipe_form_modal(state_ref.clone());
    } else {
        api::put_recipe(&*recipe).await.unwrap();

        state.dispatch(Action::UpdateRecipeForm(
            RecipeFormPatch::default()
                .is_editing(false)
                .is_loading(false)
                .is_image_changed(false)
                .to_owned(),
        ));
    }

    load_recipes(state_ref).await;
}

pub fn on_recipe_form_cancel(state_ref: StateRef) {
    log::debug!("on_recipe_form_cancel");
    let state = state_ref.borrow().clone();
    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default()
            .is_editing(false)
            .is_image_changed(false)
            .recipe(state.recipe_form.prev_recipe.clone())
            .to_owned(),
    ));
}

pub fn on_recipe_form_change(state_ref: StateRef, recipe_patch: RecipePatch) {
    log::debug!("on_recipe_form_change");
    let state = state_ref.borrow().clone();
    let mut recipe = state
        .recipe_form
        .recipe
        .as_ref()
        .expect("No recipe on form")
        .clone();
    Rc::make_mut(&mut recipe).apply_patch(recipe_patch);
    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default().recipe(Some(recipe)).to_owned(),
    ));
}

pub async fn on_recipe_form_delete(state_ref: StateRef) {
    log::debug!("on_recipe_form_delete");
    let state = state_ref.borrow().clone();
    let recipe = state.recipe_form.recipe.as_ref().unwrap();
    delete_recipe(state_ref, recipe.clone()).await;
}

pub fn on_recipe_form_ingredient_add(state_ref: StateRef) {
    // TODO: focus new item input
    log::debug!("on_recipe_form_ingredient_add");
    let state = state_ref.borrow().clone();
    let mut recipe = state.recipe_form.recipe.as_ref().unwrap().clone();
    let mut ingredients = recipe.ingredients.clone();
    ingredients.push(Rc::new(Ingredient::new()));
    Rc::make_mut(&mut recipe).ingredients = ingredients;

    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default().recipe(Some(recipe)).to_owned(),
    ));
}

pub fn on_recipe_form_ingredient_delete(state_ref: StateRef, ingredient_idx: usize) {
    log::debug!("on_recipe_form_ingredient_delete: {}", ingredient_idx);
    let state = state_ref.borrow().clone();
    let mut recipe = state.recipe_form.recipe.as_ref().unwrap().clone();
    let mut ingredients = recipe.ingredients.clone();
    ingredients.remove(ingredient_idx);
    Rc::make_mut(&mut recipe).ingredients = ingredients;

    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default().recipe(Some(recipe)).to_owned(),
    ));
}

pub fn on_recipe_form_ingredient_change(
    state_ref: StateRef,
    ingredient_idx: usize,
    description: String,
) {
    log::debug!("on_recipe_form_ingredient_change");
    let state = state_ref.borrow().clone();

    let recipe = state
        .recipe_form
        .recipe
        .as_ref()
        .expect("No recipe on form");

    let mut ingredients = recipe.ingredients.clone();
    ingredients[ingredient_idx] = Rc::new(Ingredient { description });

    on_recipe_form_change(
        state_ref,
        RecipePatch::default().ingredients(ingredients).to_owned(),
    );
}

pub fn on_recipe_form_step_add(state_ref: StateRef) {
    log::debug!("on_recipe_form_step_add");
    let state = state_ref.borrow().clone();
    let mut recipe = state.recipe_form.recipe.as_ref().unwrap().clone();
    let mut steps = recipe.steps.clone();
    steps.push(Rc::new(Step::new()));
    Rc::make_mut(&mut recipe).steps = steps;

    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default().recipe(Some(recipe)).to_owned(),
    ));
}

pub fn on_recipe_form_step_delete(state_ref: StateRef, step_idx: usize) {
    log::debug!("on_recipe_form_step_delete");
    let state = state_ref.borrow().clone();
    let mut recipe = state.recipe_form.recipe.as_ref().unwrap().clone();
    let mut steps = recipe.steps.clone();
    steps.remove(step_idx);
    Rc::make_mut(&mut recipe).steps = steps;

    state.dispatch(Action::UpdateRecipeForm(
        RecipeFormPatch::default().recipe(Some(recipe)).to_owned(),
    ));
}

pub fn on_recipe_form_step_change(state_ref: StateRef, step_idx: usize, description: String) {
    log::debug!("on_recipe_form_step_change");
    let state = state_ref.borrow().clone();

    let recipe = state
        .recipe_form
        .recipe
        .as_ref()
        .expect("No recipe on form");

    let mut steps = recipe.steps.clone();
    steps[step_idx] = Rc::new(Step { description });

    on_recipe_form_change(state_ref, RecipePatch::default().steps(steps).to_owned());
}
