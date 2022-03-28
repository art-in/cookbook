use crate::components::shared::{IconBtn, IconType};
use crate::utils::RenderProp;
use yew::function_component;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props<T>
where
    T: PartialEq,
{
    #[prop_or_default]
    pub class: Classes,
    pub title: String,
    pub items: Vec<T>,
    #[prop_or(false)]
    pub is_ordered: bool,
    #[prop_or(false)]
    pub is_editing: bool,
    pub render_item: RenderProp<(T, usize)>,
    pub on_item_add: Callback<()>,
    pub on_item_delete: Callback<usize>,
}

#[function_component(List)]
pub fn list<T>(props: &Props<T>) -> Html
where
    T: PartialEq + Clone + 'static,
{
    log::trace!("render List");
    let css = css_mod::get!("list.css");

    let on_add_btn_click = {
        let on_item_add = props.on_item_add.clone();
        Callback::from(move |_| on_item_add.emit(()))
    };
    let on_delete_btn_click = {
        let on_item_delete = props.on_item_delete.clone();
        Callback::from(move |idx| on_item_delete.emit(idx))
    };

    html! {
        <div class={classes!(css["root"], props.class.clone())}>
            <span class={css["title"]}>
                {props.title.clone()}
            </span>

            if props.is_editing {
                <IconBtn class={css["add"]} icon={IconType::Plus} on_click={on_add_btn_click} />
            }

            <ul class={props.is_ordered.then(|| css["ordered"])}>
                {for props.items.iter().cloned().enumerate().map(move |(idx, item)| {

                    let on_click = {
                        let on_delete_btn_click = on_delete_btn_click.clone();
                        Callback::from(move |_| on_delete_btn_click.emit(idx))
                    };

                    html ! {
                        <li key={idx} class={css["item"]}>
                            {(props.render_item.func)((item, idx))}
                            if props.is_editing {
                                <IconBtn
                                    class={css["delete"]}
                                    icon={IconType::Trash}
                                    {on_click}
                                />
                            }
                        </li>
                    }
                })}
            </ul>
        </div>
    }
}
