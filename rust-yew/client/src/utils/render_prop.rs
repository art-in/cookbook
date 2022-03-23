use std::rc::Rc;
use yew::Html;

/// Wrapper for a function that produce HTML, which can be passed as a property to another
/// component.
///
/// Allows to implement [render props] pattern.
///
/// [render props]: https://reactjs.org/docs/render-props.html
pub struct RenderProp<IN> {
    pub func: Rc<dyn Fn(IN) -> Html>,
}

impl<IN, F> From<F> for RenderProp<IN>
where
    F: Fn(IN) -> Html + 'static,
{
    fn from(func: F) -> Self {
        RenderProp {
            func: Rc::new(func),
        }
    }
}

impl<IN> PartialEq for RenderProp<IN> {
    fn eq(&self, other: &RenderProp<IN>) -> bool {
        // TODO: extract and compare data pointer parts of fat pointers, ignore vtable part.
        // currently there's no stable way to do that in rust. and for now ignore it, since
        // having different vptr for same render function across component renders is unlikely.
        // and even if that happen downside would be an unnecessary re-render.
        // https://stackoverflow.com/questions/61378906/how-to-obtain-address-of-trait-object
        #[allow(clippy::vtable_address_comparisons)]
        Rc::ptr_eq(&self.func, &other.func)
    }
}
