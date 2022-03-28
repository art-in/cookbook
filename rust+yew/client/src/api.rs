use crate::models::{EntitySubset, Recipe, SortDir, SortProp};
use gloo_net::http::Request;
use gloo_net::Error;
use std::rc::Rc;
use web_sys::File;

pub async fn get_recipes(
    sort_prop: SortProp,
    sort_dir: SortDir,
    page_offset: i32,
    page_limit: i32,
) -> Result<EntitySubset<Rc<Recipe>>, Error> {
    let query = format!("?sp={sort_prop}&sd={sort_dir}&po={page_offset}&pl={page_limit}");
    let res = Request::get(&format!("api/recipes{query}")).send().await?;
    let mut recipes: EntitySubset<Rc<Recipe>> = res.json().await?;
    recipes.items.iter_mut().for_each(|recipe| {
        Rc::make_mut(recipe).image_url = get_recipe_image_url(recipe);
    });
    Ok(recipes)
}

pub async fn get_recipe(recipe_id: i32) -> Result<Recipe, Error> {
    let res = Request::get(&format!("api/recipes/{}", recipe_id))
        .send()
        .await?;
    let mut recipe: Recipe = res.json().await?;
    recipe.image_url = get_recipe_image_url(&recipe);
    Ok(recipe)
}

pub async fn post_recipe(recipe: &Recipe) -> Result<i32, Error> {
    let res = Request::post("api/recipes")
        .body(serde_json::to_string(recipe).unwrap())
        .header("Content-Type", "application/json")
        .send()
        .await?;
    let recipe_id = res.text().await.unwrap().parse::<i32>().unwrap();
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

pub async fn delete_recipe(recipe_id: i32) -> Result<(), Error> {
    Request::delete(&format!("api/recipes/{recipe_id}"))
        .send()
        .await?;
    Ok(())
}

pub async fn post_recipe_image(recipe_id: i32, recipe_image: &File) -> Result<(), Error> {
    Request::post(&format!("api/recipes/{recipe_id}/image"))
        .body(recipe_image)
        .send()
        .await?;
    Ok(())
}

pub async fn delete_recipe_image(recipe_id: i32) -> Result<(), Error> {
    Request::delete(&format!("api/recipes/{recipe_id}/image"))
        .send()
        .await?;
    Ok(())
}

fn get_recipe_image_url(recipe: &Recipe) -> Option<String> {
    if recipe.has_image {
        Some(format!("api/recipes/{}/image", recipe.id))
    } else {
        None
    }
}
