use crate::components::shared::{Icon, IconBtn, IconType};
use crate::models::{Recipe, RecipePatch};
use crate::utils::{get_input_event_target_value, get_textarea_event_target_value};
use std::rc::Rc;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    #[prop_or_default]
    pub class: Classes,
    pub recipe: Rc<Recipe>,
    #[prop_or(false)]
    pub is_editing: bool,
    #[prop_or(false)]
    pub is_deletable: bool,
    #[prop_or_default]
    pub on_click: Callback<Rc<Recipe>>,
    #[prop_or_default]
    pub on_change: Callback<RecipePatch>,
    #[prop_or_default]
    pub on_delete: Callback<Rc<Recipe>>,
}

#[function_component(RecipeCard)]
pub fn recipe_card(props: &Props) -> Html {
    log::trace!("render RecipeCard");
    let css = css_mod::get!("recipe_card.css");

    let on_click = {
        let on_click = props.on_click.clone();
        let recipe = props.recipe.clone();
        Callback::from(move |_| on_click.emit(recipe.clone()))
    };
    let on_name_change = {
        let on_change = props.on_change.clone();
        Callback::from(move |event: Event| {
            let name = get_input_event_target_value(&event);
            on_change.emit(RecipePatch::default().name(name).to_owned());
        })
    };
    let on_description_change = {
        let on_change = props.on_change.clone();
        Callback::from(move |event: Event| {
            let description = get_textarea_event_target_value(&event);
            on_change.emit(RecipePatch::default().description(description).to_owned());
        })
    };
    let on_complexity_change = {
        let on_change = props.on_change.clone();
        Callback::from(move |event: Event| {
            let complexity = get_input_event_target_value(&event).parse::<i8>().unwrap();
            on_change.emit(RecipePatch::default().complexity(complexity).to_owned());
        })
    };
    let on_popularity_change = {
        let on_change = props.on_change.clone();
        Callback::from(move |event: Event| {
            let popularity = get_input_event_target_value(&event).parse::<i8>().unwrap();
            on_change.emit(RecipePatch::default().popularity(popularity).to_owned());
        })
    };

    let on_delete = {
        let on_delete = props.on_delete.clone();
        let recipe = props.recipe.clone();
        Callback::from(move |event: MouseEvent| {
            // stop event propagation to avoid triggering on_click event
            event.stop_propagation();
            on_delete.emit(recipe.clone());
        })
    };

    html! {
        <div
            class={classes!(
                css["root"],
                props.class.clone(),
                props.is_editing.then(|| css["editing"])
            )}
            onclick={on_click}
        >
            if props.is_deletable {
                <div class={css["actions"]}>
                    <IconBtn
                        icon={IconType::Trash}
                        title="Delete recipe"
                        on_click={on_delete}
                    />
                </div>
            }
            <div
                class={classes!(
                    css["image-container"],
                    props.recipe.has_image.then(|| css["empty"])
                )}
                title={if props.is_editing {"Edit image"} else {""}}
            >
                {"(no image yet)"}
            </div>
            <div class={css["props"]}>
                <input
                    class={css["name"]}
                    value={props.recipe.name.clone()}
                    placeholder="Recipe name"
                    readonly={!props.is_editing}
                    onchange={on_name_change}
                />

                <textarea
                    class={css["description"]}
                    value={props.recipe.description.clone()}
                    placeholder="Description"
                    readonly={!props.is_editing}
                    onchange={on_description_change}
                />

                <div class={css["numbers"]}>
                    <span class={css["complexity"]} title="Complexity">
                        <Icon icon={IconType::Clock} />
                        <input
                            value={props.recipe.complexity.to_string()}
                            readonly={!props.is_editing}
                            type="number"
                            min=1
                            max=10
                            onchange={on_complexity_change}
                        />
                    </span>
                    <span class={css["popularity"]} title="Popularity">
                        <Icon icon={IconType::Smile} />
                        <input
                            value={props.recipe.popularity.to_string()}
                            readonly={!props.is_editing}
                            type="number"
                            min=1
                            max=10
                            onchange={on_popularity_change}
                        />
                    </span>
                </div>
            </div>
        </div>
    }
}
