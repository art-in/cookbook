use serde::{Deserialize, Serialize};

#[derive(PartialEq, Serialize, Deserialize, Debug)]
pub struct Step {
    pub description: String,
}

impl Step {
    pub fn new() -> Self {
        Step {
            description: "".to_string(),
        }
    }
}
