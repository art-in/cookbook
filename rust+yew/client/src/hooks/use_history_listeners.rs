use gloo_history::{BrowserHistory, History};
use gloo_timers::callback::Timeout;
use yew::{use_effect_with_deps, use_ref};

/// Subscribes listeners for syncronizing app state with history state
pub fn use_history_listeners<State>(
    state: State,
    on_state_update: impl Fn(State, BrowserHistory) + 'static,
    on_history_update: impl Fn(State, BrowserHistory) + Clone + 'static,
) where
    State: Clone + 'static,
{
    let history_ref = use_ref(BrowserHistory::new);

    // suppose state was updated since this hook was called.
    //
    // schedule handler to next task so it will run after all recursive dispatches of current task
    // (eg. on_history_update can dispatch several actions on initial load, when both recipe list
    // and modal state are updated)
    {
        let state = state.clone();
        let history = (*history_ref).clone();
        Timeout::new(0, move || on_state_update(state.clone(), history)).forget();
    }

    // subscribe to history updates
    {
        let state = state.clone();
        let history = (*history_ref).clone();
        let on_history_update = on_history_update.clone();
        use_ref(move || {
            history
                .clone()
                .listen(move || on_history_update(state.clone(), history.clone()))
        });
    }

    // trigger initial sync
    let history = (*history_ref).clone();
    use_effect_with_deps(
        move |_| {
            on_history_update(state.clone(), history);
            || {}
        },
        (),
    );
}
