use yew::prelude::*;

#[derive(Properties, PartialEq, Clone)]
pub struct Props {
    #[prop_or_default]
    pub class: Classes,
    #[prop_or(false)]
    pub is_active: bool,
    #[prop_or(false)]
    pub is_disabled: bool,
    pub children: Children,
    pub on_click: Callback<MouseEvent>,
}

#[function_component(Btn)]
pub fn btn(props: &Props) -> Html {
    log::trace!("render Btn");
    let css = css_mod::get!("btn.css");
    html! {
        <button
            class={classes!(css["root"], props.is_active.then(|| css["active"]), props.class.clone())}
            disabled={props.is_disabled}
            onclick={props.on_click.clone()}
        >
            {for props.children.iter()}
        </button>
    }
}
