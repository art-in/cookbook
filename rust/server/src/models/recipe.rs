use crate::storage::db::schema::recipes;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Debug, Serialize, Deserialize, AsChangeset)]
pub struct Recipe {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub complexity: i16,
    pub popularity: i16,
    pub has_image: bool,
    pub ingredients: String,
    pub steps: String,
}

#[derive(Insertable, Deserialize)]
#[table_name = "recipes"]
pub struct NewRecipe {
    pub name: String,
    pub description: String,
    pub complexity: i16,
    pub popularity: i16,
    pub has_image: bool,
    pub ingredients: String,
    pub steps: String,
}
