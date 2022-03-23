use std::{cell::RefCell, rc::Rc};
use yew::{use_mut_ref, use_reducer, Reducible, UseReducerHandle};

/// Creates reducer handle wrapped into reference.
///
/// Returned reference always points to most recent reducer handle.
///
/// Use-case example: since reference is stable, it can be closured once and all further calls to
/// this closure will access most recent reducer handle without recreating closure itself
///
/// # Example:
///
/// ```
/// // state ref will not change on state changes
/// let state_ref = use_reducer_eq_ref(|| 5);
///
/// // callback ref will not change either
/// let callback_ref = use_callback(state_ref.clone(), |state_ref, _| {
///     // callback always has access to fresh state through ref
///     let state_handle = state_ref.borrow().clone();
///
///     state_handle.dispatch(Action...);
///
///     // after update in order to access fresh state we need to re-extract handle from ref
///     // because old handle still points to previous state
///     let state_handle = state_ref.borrow().clone();
/// });
/// ```
pub fn use_reducer_ref<F, T>(initial_fn: F) -> Rc<RefCell<UseReducerHandle<T>>>
where
    F: FnOnce() -> T,
    T: Reducible + PartialEq + 'static,
{
    // handle gets updated every time reducible value is updated through action dispatch
    let handle = use_reducer(initial_fn);

    // reference, in contrary, always stays the same. we just update reference target
    let handle_clone = handle.clone();
    let handle_ref = use_mut_ref(move || handle_clone);
    *handle_ref.borrow_mut() = handle;
    handle_ref
}
