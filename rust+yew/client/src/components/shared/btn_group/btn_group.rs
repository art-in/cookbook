use crate::components::shared::Btn;
use std::rc::Rc;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    #[prop_or_default]
    pub class: Classes,
    pub children: ChildrenWithProps<Btn>,
}

#[function_component(BtnGroup)]
pub fn btn_group(props: &Props) -> Html {
    log::trace!("render BtnGroup");
    let css = css_mod::get!("btn_group.css");

    // add "item" class to each child
    let children = props.children.iter().map(|mut comp| {
        Rc::make_mut(&mut comp.props).class = classes!(comp.props.class.clone(), css["item"]);
        comp
    });

    html! {
        <span class={classes!(css["root"], props.class.clone())}>
            {for children}
        </span>
    }
}
