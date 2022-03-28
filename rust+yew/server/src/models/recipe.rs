use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Recipe {
    // ignore id for new recipe
    #[serde(skip_deserializing)]
    pub id: i32,
    pub name: String,
    pub description: String,
    pub complexity: i16,
    pub popularity: i16,
    pub has_image: bool,
    pub ingredients: serde_json::Value,
    pub steps: serde_json::Value,
}
