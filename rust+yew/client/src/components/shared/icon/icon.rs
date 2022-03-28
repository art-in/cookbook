use super::images::{
    ClockIcon, EraserIcon, IconProps, PencilIcon, PlusIcon, SaveIcon, SmileIcon, SpinnerIcon,
    TimesIcon, TrashIcon,
};
use super::IconType;
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
    #[prop_or_default]
    pub on_click: Callback<MouseEvent>,
}

#[function_component(Icon)]
pub fn icon(props: &Props) -> Html {
    log::trace!("render Icon");

    let icon_props = IconProps {
        class: props.class.clone(),
        style: "vertical-align: sub;".to_string(),
        title: props.title.clone(),
        width: props.width,
        on_click: props.on_click.clone(),
    };

    match props.icon {
        IconType::Clock => html! {<ClockIcon ..icon_props />},
        IconType::Eraser => html! {<EraserIcon ..icon_props />},
        IconType::Pencil => html! {<PencilIcon ..icon_props />},
        IconType::Plus => html! {<PlusIcon ..icon_props />},
        IconType::Save => html! {<SaveIcon ..icon_props />},
        IconType::Smile => html! {<SmileIcon ..icon_props />},
        IconType::Spinner => html! {<SpinnerIcon ..icon_props />},
        IconType::Times => html! {<TimesIcon ..icon_props />},
        IconType::Trash => html! {<TrashIcon ..icon_props />},
    }
}
