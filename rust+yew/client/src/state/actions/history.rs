use crate::models::{RecipeListPatch, SortDir, SortProp, StateRef};
use crate::state::actions::{close_recipe_form_modal, load_recipes, open_recipe_modal};
use crate::state::reducer::Action;
use crate::utils::is_default;
use gloo_history::{BrowserHistory, History};
use serde::{Deserialize, Serialize};
use wasm_bindgen_futures::spawn_local;

#[derive(Debug, Default, PartialEq, Serialize, Deserialize)]
struct HistoryState {
    #[serde(default, rename = "rid", skip_serializing_if = "is_default")]
    pub recipe_id: Option<i64>,
    #[serde(default, rename = "sp", skip_serializing_if = "is_default")]
    pub sort_prop: SortProp,
    #[serde(default, rename = "sd", skip_serializing_if = "is_default")]
    pub sort_dir: SortDir,
    #[serde(default, rename = "p", skip_serializing_if = "is_default")]
    pub current_page_idx: i64,
}

pub fn map_state_to_history(state_ref: StateRef, history: BrowserHistory) {
    log::info!("map_state_to_history");
    let state = state_ref.borrow().to_owned();

    let history_state = HistoryState {
        recipe_id: state.recipe_form.recipe_id,
        sort_prop: state.recipe_list.sort_prop,
        sort_dir: state.recipe_list.sort_dir,
        current_page_idx: state.recipe_list.current_page_idx,
    };

    let current_history_state: HistoryState = history.location().query().unwrap();

    if history_state != current_history_state {
        history.push_with_query("", history_state).unwrap();
    }
}

pub fn map_history_to_state(state_ref: StateRef, history: BrowserHistory) {
    spawn_local(map_history_to_state_internal(state_ref, history));
}

async fn map_history_to_state_internal(state_ref: StateRef, history: BrowserHistory) {
    let history_state: HistoryState = history.location().query().unwrap();
    log::info!("map_history_to_state: {:?}", history_state);

    let state = state_ref.borrow().to_owned();
    let history_state: HistoryState = history.location().query().unwrap();

    let mut reload_recipes = false;

    if history_state.recipe_id != state.recipe_form.recipe_id {
        if let Some(recipe_id) = history_state.recipe_id {
            open_recipe_modal(state_ref.clone(), recipe_id).await;
        } else {
            close_recipe_form_modal(state_ref.clone());
        }
    }

    if history_state.sort_prop != state.recipe_list.sort_prop
        || history_state.sort_dir != state.recipe_list.sort_dir
        || history_state.current_page_idx != state.recipe_list.current_page_idx
    {
        // TODO: move to first page if history page is unreachable
        state.dispatch(Action::UpdateRecipeList(
            RecipeListPatch::default()
                .sort_prop(history_state.sort_prop)
                .sort_dir(history_state.sort_dir)
                .current_page_idx(history_state.current_page_idx)
                .to_owned(),
        ));
        reload_recipes = true;
    }

    if state.recipe_list.is_first_load || reload_recipes {
        load_recipes(state_ref).await;
    }
}
