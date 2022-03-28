use crate::components::shared::{IconBtn, IconType, List, Waiter};
use crate::components::RecipeCard;
use crate::hooks::use_callback;
use crate::models::{self, Ingredient, StateRef, Step};
use crate::state::actions;
use crate::utils::{get_input_event_target_value, RenderProp};
use std::rc::Rc;
use wasm_bindgen_futures::spawn_local;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub recipe_form: Rc<models::RecipeForm>,
}

#[function_component(RecipeForm)]
pub fn recipe_form(props: &Props) -> Html {
    log::trace!("render RecipeForm");
    let css = css_mod::get!("recipe_form.css");

    let state_ref = use_context::<StateRef>().expect("no ctx found");

    let models::RecipeForm {
        is_cancelable,
        is_editing,
        is_editable,
        is_deletable,
        is_loading,
        ..
    } = *props.recipe_form;

    let on_edit = use_callback(state_ref.clone(), |state_ref, _| {
        actions::on_recipe_form_edit(state_ref);
    });
    let on_save = use_callback(state_ref.clone(), |state_ref, _| {
        spawn_local(actions::on_recipe_form_save(state_ref));
    });
    let on_cancel = use_callback(state_ref.clone(), |state_ref, _| {
        actions::on_recipe_form_cancel(state_ref);
    });
    let on_change = use_callback(state_ref.clone(), |state_ref, recipe_patch| {
        actions::on_recipe_form_change(state_ref, recipe_patch);
    });
    let on_delete = use_callback(state_ref.clone(), |state_ref, _| {
        spawn_local(actions::on_recipe_form_delete(state_ref));
    });
    let on_ingredient_add = use_callback(state_ref.clone(), |state_ref, ()| {
        actions::on_recipe_form_ingredient_add(state_ref);
    });
    let on_ingredient_delete = use_callback(state_ref.clone(), |state_ref, ingredient_idx| {
        actions::on_recipe_form_ingredient_delete(state_ref, ingredient_idx);
    });
    let on_ingredient_change = use_callback(
        state_ref.clone(),
        |state_ref, (ingredient_idx, event): (usize, Event)| {
            let description = get_input_event_target_value(&event);
            actions::on_recipe_form_ingredient_change(state_ref, ingredient_idx, description);
        },
    );
    let on_step_add = use_callback(state_ref.clone(), |state_ref, ()| {
        actions::on_recipe_form_step_add(state_ref);
    });
    let on_step_delete = use_callback(state_ref.clone(), |state_ref, step_idx| {
        actions::on_recipe_form_step_delete(state_ref, step_idx);
    });
    let on_step_change = use_callback(
        state_ref.clone(),
        |state_ref, (step_idx, event): (usize, Event)| {
            let description = get_input_event_target_value(&event);
            actions::on_recipe_form_step_change(state_ref, step_idx, description);
        },
    );
    let on_image_change = use_callback(state_ref.clone(), |state_ref, image_file| {
        actions::on_recipe_form_image_change(state_ref, image_file);
    });
    let on_image_delete = use_callback(state_ref, |state_ref, _| {
        actions::on_recipe_form_image_delete(state_ref);
    });

    html! {
        <div class={css["root"]}>
            if let Some(recipe) = &props.recipe_form.recipe {

                <RecipeCard
                    recipe={recipe}
                    is_editing={is_editing}
                    on_change={&*on_change}
                    on_image_change={&*on_image_change}
                    on_image_delete={&*on_image_delete}
                />

                <List<Rc<Ingredient>>
                    title="Ingredients:"
                    class={css["ingredients"]}
                    items={recipe.ingredients.clone()}
                    {is_editing}
                    on_item_add={&*on_ingredient_add}
                    on_item_delete={&*on_ingredient_delete}
                    render_item={RenderProp::from(
                        move |(ingredient, idx) : (Rc<Ingredient>, usize)| {

                            let onchange = {
                                let on_ingredient_change = on_ingredient_change.clone();
                                move |event| {
                                    on_ingredient_change.emit((idx, event));
                                }
                            };

                            html! {
                                <input
                                    class={css["ingredient"]}
                                    value={ingredient.description.clone()}
                                    readonly={!is_editing}
                                    {onchange}
                                />
                            }
                        }
                    )}
                />

                <List<Rc<Step>>
                    title="Steps:"
                    class={css["steps"]}
                    items={recipe.steps.clone()}
                    {is_editing}
                    is_ordered=true
                    on_item_add={&*on_step_add}
                    on_item_delete={&*on_step_delete}
                    render_item={RenderProp::from(
                        move |(step, idx) : (Rc<Step>, usize)| {

                            let onchange = {
                                let on_step_change = on_step_change.clone();
                                move |event| {
                                    on_step_change.emit((idx, event));
                                }
                            };

                            html! {
                                <input
                                    class={css["step"]}
                                    value={step.description.clone()}
                                    readonly={!is_editing}
                                    {onchange}
                                />
                            }
                        }
                    )}
                />
            }

            <div class={css["actions"]}>
                if is_editable && !is_editing {
                    <IconBtn
                        title="Edit"
                        class={css["action"]}
                        icon={IconType::Pencil}
                        on_click={&*on_edit}
                    />
                }
                if is_editable && is_editing {
                    <IconBtn
                        title="Save"
                        class={css["action"]}
                        icon={IconType::Save}
                        on_click={&*on_save}
                    />
                }
                if is_editable && is_cancelable && is_editing {
                    <IconBtn
                        title="Cancel"
                        class={css["action"]}
                        icon={IconType::Eraser}
                        on_click={&*on_cancel}
                    />
                }
                if is_deletable {
                    <IconBtn
                        title="Delete"
                        class={css["action"]}
                        icon={IconType::Trash}
                        on_click={&*on_delete}
                    />
                }
            </div>

            if is_loading { <Waiter /> }
        </div>
    }
}
