use crate::components::shared::{IconBtn, IconType};
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    #[prop_or_default]
    pub front_class: Classes,
    pub children: Children,
    pub is_visible: bool,
    pub on_close: Callback<()>,
}

#[function_component(Modal)]
pub fn modal(props: &Props) -> Html {
    log::trace!("render Modal");
    let css = css_mod::get!("modal.css");

    let on_close = {
        let on_close = props.on_close.clone();
        Callback::from(move |_| on_close.emit(()))
    };

    html! {
        <div class={classes!(css["root"], props.is_visible.then(|| css["visible"]))}>
            <div class={css["back"]} onclick={on_close.clone()} />
            <div class={classes!(css["front"], props.front_class.clone())}>
                {for props.children.iter()}
                <IconBtn
                    class={css["close"]}
                    icon={IconType::Times}
                    on_click={on_close}
                />
            </div>
        </div>
    }
}
