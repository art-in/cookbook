use serde::Serialize;

#[derive(Serialize)]
pub struct EntitySubset<T> {
    pub items: Vec<T>,
    pub total: i64,
}
