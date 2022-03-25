use crate::components::{RecipeFormModal, RecipeList};
use crate::hooks::{use_history_listeners, use_reducer_ref};
use crate::models::{State, StateRef};
use crate::state::actions::{map_history_to_state, map_state_to_history};
use yew::prelude::*;

#[function_component(App)]
pub fn app() -> Html {
    log::trace!("render App");
    let css = css_mod::get!("app.css");

    let state_ref: StateRef = use_reducer_ref(State::default);
    use_history_listeners(
        state_ref.clone(),
        map_state_to_history,
        map_history_to_state,
    );

    html! {
        <ContextProvider<StateRef> context={state_ref.clone()}>
            <div class={css["root"]}>
                <RecipeList recipe_list={state_ref.borrow().recipe_list.clone()} />
                <RecipeFormModal recipe_form={state_ref.borrow().recipe_form.clone()} />
            </div>
        </ContextProvider<StateRef>>
    }
}
