use crate::components::shared::{Icon, IconType};
use yew::function_component;
use yew::prelude::*;

#[function_component(Waiter)]
pub fn waiter() -> Html {
    log::trace!("render Waiter");
    let css = css_mod::get!("waiter.css");

    html! {
        <div class={css["root"]}>
            <div class={css["back"]} />
            <Icon icon={IconType::Spinner} class={css["spinner"]} width=40 />
        </div>
    }
}
