use crate::models::{EntitySubset, Recipe, SortDir, SortProp};
use gloo_net::http::Request;
use gloo_net::Error;
use std::rc::Rc;

pub async fn get_recipes(
    sort_prop: SortProp,
    sort_dir: SortDir,
    page_offset: i64,
    page_limit: i64,
) -> Result<EntitySubset<Rc<Recipe>>, Error> {
    let query = format!("?sp={sort_prop}&sd={sort_dir}&po={page_offset}&pl={page_limit}");
    let res = Request::get(&format!("api/recipes{query}")).send().await?;
    let res = res.json().await?;
    Ok(res)
}

pub async fn get_recipe(recipe_id: i64) -> Result<Recipe, Error> {
    let res = Request::get(&format!("api/recipes/{}", recipe_id))
        .send()
        .await?;
    let res: Recipe = res.json().await?;
    Ok(res)
}

pub async fn post_recipe(recipe: &Recipe) -> Result<i64, Error> {
    let res = Request::post("api/recipes")
        .body(serde_json::to_string(recipe).unwrap())
        .header("Content-Type", "application/json")
        .send()
        .await?;
    let recipe_id = res.text().await.unwrap().parse::<i64>().unwrap();
    Ok(recipe_id)
}

pub async fn put_recipe(recipe: &Recipe) -> Result<(), Error> {
    Request::put(&format!("api/recipes/{}", recipe.id))
        .body(serde_json::to_string(recipe).unwrap())
        .header("Content-Type", "application/json")
        .send()
        .await?;
    Ok(())
}

pub async fn delete_recipe(recipe_id: i64) -> Result<(), Error> {
    Request::delete(&format!("api/recipes/{}", recipe_id))
        .send()
        .await?;
    Ok(())
}
