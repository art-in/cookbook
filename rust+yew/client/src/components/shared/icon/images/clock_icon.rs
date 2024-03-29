use super::IconProps;
use yew::prelude::*;

#[function_component(ClockIcon)]
pub fn clock_icon(props: &IconProps) -> Html {
    html! {
        <svg
            class={props.class.clone()}
            style={props.style.clone()}
            width={props.width.to_string()}
            onclick={props.on_click.clone()}
            aria-hidden="true"
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
        >
            <title>{props.title.clone()}</title>
            <path
                fill="currentColor"
                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm57.1 350.1L224.9 294c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v137.7l63.5 46.2c5.4 3.9 6.5 11.4 2.6 16.8l-28.2 38.8c-3.9 5.3-11.4 6.5-16.8 2.6z">
            </path>
        </svg>
    }
}
