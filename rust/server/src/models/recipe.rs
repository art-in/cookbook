use crate::storage::db::schema::recipes;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Debug, Serialize, Deserialize, AsChangeset)]
#[serde(rename_all = "camelCase")]
pub struct Recipe {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub complexity: i16,
    pub popularity: i16,
    pub has_image: bool,
    pub ingredients: serde_json::Value,
    pub steps: serde_json::Value,
}

#[derive(Insertable, Deserialize)]
#[table_name = "recipes"]
#[serde(rename_all = "camelCase")]
pub struct NewRecipe {
    pub name: String,
    pub description: String,
    pub complexity: i16,
    pub popularity: i16,
    pub has_image: bool,
    pub ingredients: serde_json::Value,
    pub steps: serde_json::Value,
}
