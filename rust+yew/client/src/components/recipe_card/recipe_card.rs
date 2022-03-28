use crate::components::shared::{Icon, IconBtn, IconType};
use crate::models::{Recipe, RecipePatch};
use crate::utils::{get_input_event_target_value, get_textarea_event_target_value};
use std::rc::Rc;
use wasm_bindgen::JsCast;
use web_sys::{File, HtmlInputElement};
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
    #[prop_or_default]
    pub on_image_change: Callback<File>,
    #[prop_or_default]
    pub on_image_delete: Callback<()>,
}

#[function_component(RecipeCard)]
pub fn recipe_card(props: &Props) -> Html {
    log::trace!("render RecipeCard");
    let css = css_mod::get!("recipe_card.css");

    let image_input_ref = use_node_ref();

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
            let complexity = get_input_event_target_value(&event).parse::<i16>().unwrap();
            on_change.emit(RecipePatch::default().complexity(complexity).to_owned());
        })
    };
    let on_popularity_change = {
        let on_change = props.on_change.clone();
        Callback::from(move |event: Event| {
            let popularity = get_input_event_target_value(&event).parse::<i16>().unwrap();
            on_change.emit(RecipePatch::default().popularity(popularity).to_owned());
        })
    };
    let on_delete = {
        let on_delete = props.on_delete.clone();
        let recipe = props.recipe.clone();
        Callback::from(move |event: MouseEvent| {
            // avoid triggering on_click event
            event.stop_propagation();
            on_delete.emit(recipe.clone());
        })
    };
    let on_image_click = {
        let image_input_ref = image_input_ref.clone();
        let is_editing = props.is_editing;
        Callback::from(move |_| {
            if is_editing {
                let image_input = image_input_ref.cast::<HtmlInputElement>().unwrap();

                // trigger file dialog
                image_input.focus().unwrap();
                image_input.click();
            }
        })
    };
    let on_image_change = {
        let on_image_change = props.on_image_change.clone();
        Callback::from(move |event: Event| {
            let file = event
                .target()
                .unwrap()
                .dyn_ref::<HtmlInputElement>()
                .unwrap()
                .files()
                .unwrap()
                .get(0)
                .unwrap();
            on_image_change.emit(file);
        })
    };
    let on_image_delete = {
        let on_image_delete = props.on_image_delete.clone();
        Callback::from(move |event: MouseEvent| {
            // avoid triggering on_image_click event
            event.stop_propagation();
            on_image_delete.emit(());
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
                    (!props.recipe.has_image).then(|| css["empty"])
                )}
                title={if props.is_editing {"Edit image"} else {""}}
                onclick={on_image_click}
            >
                if props.recipe.has_image {
                    <img
                        src={props.recipe.image_url.as_ref().unwrap().to_owned()}
                        alt={props.recipe.name.clone()}
                    />
                } else {
                    <div class={css["image-stub"]}>
                        if props.is_editing {{"(click to set image)"}} else {{"(no image yet)"}}
                    </div>
                }

                if props.is_editing && props.recipe.has_image {
                    <IconBtn
                        class={css["delete"]}
                        icon={IconType::Trash}
                        title="Delete image"
                        on_click={on_image_delete}
                    />
                }

                if props.is_editing {
                    <input
                        type="file"
                        ref={image_input_ref.clone()}
                        onchange={on_image_change}
                    />
                }

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
