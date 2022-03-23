use crate::components::shared::{Btn, BtnGroup, IconBtn, IconType, Waiter};
use crate::components::RecipeCard;
use crate::hooks::use_callback;
use crate::models::{SortProp, StateRef};
use crate::state::actions;
use std::rc::Rc;
use wasm_bindgen_futures::spawn_local;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub recipe_list: Rc<crate::models::RecipeList>,
}

#[function_component(RecipeList)]
pub fn recipe_list(props: &Props) -> Html {
    log::trace!("render RecipeList");
    let css = css_mod::get!("recipe_list.css");

    let state_ref = use_context::<StateRef>().expect("ctx not found");
    let recipe_list = props.recipe_list.clone();
    let pages_count = (recipe_list.total as f64 / recipe_list.page_limit as f64).ceil() as i64;

    let on_add = use_callback(state_ref.clone(), |state_ref, _| {
        actions::on_recipe_list_add(state_ref)
    });
    let on_sort = use_callback(state_ref.clone(), |state_ref, sort_prop| {
        spawn_local(actions::on_recipe_list_sort(state_ref, sort_prop));
    });
    let on_page = use_callback(state_ref.clone(), move |state_ref, page_idx| {
        spawn_local(actions::on_recipe_list_page(state_ref, page_idx));
    });
    let on_item_click = use_callback(state_ref.clone(), |state_ref, recipe| {
        spawn_local(actions::on_recipe_list_item_click(state_ref, recipe));
    });
    let on_item_delete = use_callback(state_ref.clone(), |state_ref, recipe| {
        spawn_local(actions::on_recipe_list_item_delete(state_ref, recipe));
    });

    let create_on_sort_callback = move |sort_prop: SortProp| {
        let on_sort = on_sort.clone();
        use_callback(state_ref.clone(), move |_, _| on_sort.emit(sort_prop))
    };
    let create_on_page_callback = move |page_idx| {
        let on_page = on_page.clone();
        // not memoizing callback because page buttons are created dynamically
        Callback::from(move |_| on_page.emit(page_idx))
    };

    html! {
        <div class={css["root"]}>
            <div class={css["header"]}>
                <IconBtn icon={IconType::Plus} width=30 title="Add recipe" on_click={&*on_add} />
                <BtnGroup>
                    <Btn
                        is_active={recipe_list.sort_prop == SortProp::Name}
                        on_click={&*create_on_sort_callback(SortProp::Name)}
                    >
                        {"by name"}
                    </Btn>
                    <Btn
                        is_active={recipe_list.sort_prop == SortProp::Complexity}
                        on_click={&*create_on_sort_callback(SortProp::Complexity)}
                    >
                        {"by complexity"}
                    </Btn>
                    <Btn
                        is_active={recipe_list.sort_prop == SortProp::Popularity}
                        on_click={&*create_on_sort_callback(SortProp::Popularity)}
                    >
                        {"by popularity"}
                    </Btn>
                </BtnGroup>
            </div>
            <div class={css["items"]}>
                if recipe_list.items.is_empty() {
                    <div class={css["empty"]}>{"No recipes yet"}</div>
                } else {
                    <div>
                        {for recipe_list.items.iter().map(move |recipe| html! {
                            <RecipeCard
                                class={css["item"]}
                                key={recipe.id}
                                recipe={recipe}
                                is_deletable=true
                                on_click={&*on_item_click}
                                on_delete={&*on_item_delete}
                            />
                        })}
                    </div>
                }
                if recipe_list.is_loading { <Waiter /> }
            </div>
            <div class={css["footer"]}>
                <BtnGroup>
                    {for (0..pages_count).map(|page_idx| html_nested ! {
                        <Btn
                            key={page_idx}
                            is_active={page_idx == recipe_list.current_page_idx}
                            is_disabled={page_idx == recipe_list.current_page_idx}
                            on_click={create_on_page_callback(page_idx)}
                        >
                            {page_idx + 1}
                        </Btn>
                    })}
                </BtnGroup>
            </div>
        </div>
    }
}
