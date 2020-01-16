use wasm_bindgen::prelude::*;

pub mod effects;
mod utils;

// https://github.com/rustwasm/console_error_panic_hook
#[wasm_bindgen]
pub fn set_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}
