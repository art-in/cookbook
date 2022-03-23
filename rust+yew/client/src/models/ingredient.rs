use serde::{Deserialize, Serialize};

#[derive(PartialEq, Serialize, Deserialize, Debug)]
pub struct Ingredient {
    pub description: String,
}

impl Ingredient {
    pub fn new() -> Self {
        Ingredient {
            description: "".to_string(),
        }
    }
}
