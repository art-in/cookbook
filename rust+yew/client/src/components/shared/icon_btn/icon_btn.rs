use crate::components::shared::{Icon, IconType};
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    #[prop_or_default]
    pub class: Classes,
    pub icon: IconType,
    #[prop_or_default]
    pub title: String,
    #[prop_or(20)]
    pub width: i32,
    pub on_click: Callback<MouseEvent>,
}

#[function_component(IconBtn)]
pub fn icon_btn(props: &Props) -> Html {
    log::trace!("render IconBtn");
    let css = css_mod::get!("icon_btn.css");
    html! {
        <Icon
            class={classes!(css["root"], props.class.clone())}
            icon={props.icon}
            title={props.title.clone()}
            width={props.width}
            on_click={props.on_click.clone()}
        />
    }
}
