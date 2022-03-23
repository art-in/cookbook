mod api;
mod components;
mod hooks;
mod models;
mod state;
mod utils;

use crate::components::App;

fn main() {
    css_mod::init!();
    wasm_logger::init(wasm_logger::Config::new(log::Level::Trace).message_on_new_line());

    yew::start_app::<App>();
}
