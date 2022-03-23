use crate::components::{RecipeFormModal, RecipeList};
use crate::hooks::use_reducer_ref;
use crate::models::{State, StateRef};
use crate::state::actions::load_recipes;
use wasm_bindgen_futures::spawn_local;
use yew::prelude::*;

#[function_component(App)]
pub fn app() -> Html {
    log::trace!("render App");
    let css = css_mod::get!("app.css");

    let state_ref: StateRef = use_reducer_ref(State::default);

    {
        let state_ref = state_ref.clone();
        use_effect_with_deps(
            move |_| {
                spawn_local(load_recipes(state_ref));
                || {}
            },
            (),
        );
    }

    html! {
        <ContextProvider<StateRef> context={state_ref.clone()}>
            <div class={css["root"]}>
                <RecipeList recipe_list={state_ref.borrow().recipe_list.clone()} />
                <RecipeFormModal recipe_form={state_ref.borrow().recipe_form.clone()} />
            </div>
        </ContextProvider<StateRef>>
    }
}
