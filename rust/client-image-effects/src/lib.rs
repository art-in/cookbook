use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn say_hello() -> String {
    "hello".to_string()
}
