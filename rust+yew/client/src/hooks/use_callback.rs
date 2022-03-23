use std::{cell::RefCell, rc::Rc};

use yew::{use_ref, Callback};

/// Creates memoized callback bound to external data through reference.
///
/// This is just convenience method which helps to reduce boilerplate a bit and to be a place for
/// the comment that explains reasoning behind callback memoization.
///
/// If function component creates new `Callback` every time it renders receiving child component
/// will always re-render because of property change. In order to prevent unnecessary child
/// re-renders, callback or its internal closure should be stable, ie. not change over time. But in
/// this case it can closure external values which will stale over time, so external data this
/// callback depend on should be wrapped into reference (`use_ref()`).
///
/// React's `use_callback` uses different approach - it allows to specify dependencies, and
/// recreates callback everytime dependency change. but in our case callbacks will mostly dispatch
/// state actions, which forces callbacks to depend on state handle, and we don't want to recreate
/// all callbacks (thus re-render entire component tree) everytime any part of state is changed.
///
/// Ideally yew should have `use_callback` hook which receives dependencies (like in `react`), and
/// there's `use_dispatch` hook which provides dispatcher which allows to dispatch functions
/// (ie. not only actions, but action creators too, like in `redux-thunk`), which allows to get
/// current state through `get_state` argument. so callback itself doesn't depend on state.
pub fn use_callback<Data, CbParam, Cb>(rf: Rc<RefCell<Data>>, cb: Cb) -> Rc<Callback<CbParam>>
where
    Data: Clone + 'static,
    CbParam: 'static,
    Cb: Fn(Rc<RefCell<Data>>, CbParam) + 'static,
{
    // create callback once and store it into component state
    use_ref(move || {
        Callback::from(move |param: CbParam| {
            cb(rf.clone(), param);
        })
    })
}
