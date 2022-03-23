use wasm_bindgen::JsCast;
use web_sys::{Event, HtmlInputElement, HtmlTextAreaElement};

fn get_event_target_value<T: JsCast + Clone>(event: &Event) -> T {
    event
        .target()
        .expect("Event doesn't have a target")
        .dyn_ref::<T>()
        .expect("Wrong HTML element type")
        .to_owned()
}

pub fn get_input_event_target_value(event: &Event) -> String {
    get_event_target_value::<HtmlInputElement>(event).value()
}

pub fn get_textarea_event_target_value(event: &Event) -> String {
    get_event_target_value::<HtmlTextAreaElement>(event).value()
}
