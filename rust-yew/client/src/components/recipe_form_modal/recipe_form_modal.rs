use crate::components::{shared::Modal, RecipeForm};
use crate::hooks::use_callback;
use crate::models::{self, StateRef};
use crate::state::actions::on_recipe_form_modal_close;
use std::rc::Rc;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub recipe_form: Rc<models::RecipeForm>,
}

#[function_component(RecipeFormModal)]
pub fn recipe_form_modal(props: &Props) -> Html {
    log::trace!("render RecipeFormModal");
    let state_ref = use_context::<StateRef>().expect("ctx not found");

    let on_close = use_callback(state_ref, |state_ref, ()| {
        on_recipe_form_modal_close(state_ref);
    });

    html! {
        <Modal is_visible={props.recipe_form.is_visible} on_close={&*on_close} >
            <RecipeForm recipe_form={props.recipe_form.clone()} />
        </Modal>
    }
}
