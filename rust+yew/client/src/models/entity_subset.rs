use serde::Deserialize;

#[derive(Deserialize)]
pub struct EntitySubset<T> {
    pub items: Vec<T>,
    pub total: i32,
}
