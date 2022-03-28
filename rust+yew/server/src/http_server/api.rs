use crate::{
    http_server::{error::ResponseError, AppState},
    models::Recipe,
};
use actix_web::{
    delete, get, post, put,
    web::{self, Bytes},
    Error, HttpResponse, Scope,
};
use serde::Deserialize;

pub fn scope() -> Scope {
    web::scope("/api")
        .service(get_recipes)
        .service(get_recipe)
        .service(post_recipe)
        .service(delete_recipe)
        .service(put_recipe)
        .service(post_recipe_image)
        .service(get_recipe_image)
        .service(delete_recipe_image)
}

static DEFAULT_SORT_PROP: &str = "id";
static DEFAULT_SORT_DIR: &str = "asc";
static DEFAULT_PAGE_OFFSET: i32 = 0;
static DEFAULT_PAGE_LIMIT: i32 = 1000;

#[derive(Deserialize)]
struct GetRecipesParams {
    #[serde(rename = "sp")]
    sort_prop: Option<String>,

    #[serde(rename = "sd")]
    sort_dir: Option<String>,

    #[serde(rename = "po")]
    page_offset: Option<i32>,

    #[serde(rename = "pl")]
    page_limit: Option<i32>,
}

#[get("/recipes")]
async fn get_recipes(
    state: web::Data<AppState>,
    query: web::Query<GetRecipesParams>,
) -> Result<HttpResponse, Error> {
    let recipes = state
        .db
        .get_recipes(
            query
                .sort_prop
                .as_ref()
                .map(|s| &s[..])
                .unwrap_or(DEFAULT_SORT_PROP),
            query
                .sort_dir
                .as_ref()
                .map(|s| &s[..])
                .unwrap_or(DEFAULT_SORT_DIR),
            query.page_offset.unwrap_or(DEFAULT_PAGE_OFFSET),
            query.page_limit.unwrap_or(DEFAULT_PAGE_LIMIT),
        )
        .await
        .map_err(ResponseError::Internal)?;

    Ok(HttpResponse::Ok().json(recipes))
}

#[get("/recipes/{recipe_id}")]
async fn get_recipe(
    state: web::Data<AppState>,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let recipe_id = path.into_inner();

    let recipe = state
        .db
        .get_recipe(recipe_id)
        .await
        .map_err(ResponseError::Internal)?
        .ok_or(ResponseError::RecipeNotFound(recipe_id))?;

    Ok(HttpResponse::Ok().json(recipe))
}

#[post("/recipes")]
async fn post_recipe(
    state: web::Data<AppState>,
    body: web::Json<Recipe>,
) -> Result<HttpResponse, Error> {
    let recipe = body.into_inner();

    let recipe_id = state
        .db
        .add_recipe(recipe)
        .await
        .map_err(ResponseError::Internal)?;

    Ok(HttpResponse::Ok().body(recipe_id.to_string()))
}

#[delete("/recipes/{recipe_id}")]
async fn delete_recipe(
    state: web::Data<AppState>,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let recipe_id = path.into_inner();

    let recipe = state
        .db
        .get_recipe(recipe_id)
        .await
        .map_err(ResponseError::Internal)?
        .ok_or(ResponseError::RecipeNotFound(recipe_id))?;

    state
        .db
        .delete_recipe(recipe_id)
        .await
        .map_err(ResponseError::Internal)?;

    if recipe.has_image {
        state
            .images
            .delete_recipe_image(recipe_id)
            .await
            .map_err(ResponseError::Internal)?;
    }

    Ok(HttpResponse::Ok().into())
}

#[put("/recipes/{recipe_id}")]
async fn put_recipe(
    state: web::Data<AppState>,
    path: web::Path<i32>,
    body: web::Json<Recipe>,
) -> Result<HttpResponse, Error> {
    let recipe_id = path.into_inner();

    let mut recipe = body.into_inner();
    recipe.id = recipe_id;

    let updated = state
        .db
        .update_recipe(&recipe)
        .await
        .map_err(ResponseError::Internal)?;

    if !updated {
        Err(ResponseError::RecipeNotFound(recipe_id).into())
    } else {
        Ok(HttpResponse::Ok().into())
    }
}

#[post("/recipes/{recipe_id}/image")]
async fn post_recipe_image(
    state: web::Data<AppState>,
    path: web::Path<i32>,
    image: Bytes,
) -> Result<HttpResponse, Error> {
    let recipe_id = path.into_inner();

    let mut recipe = state
        .db
        .get_recipe(recipe_id)
        .await
        .map_err(ResponseError::Internal)?
        .ok_or(ResponseError::RecipeNotFound(recipe_id))?;

    state
        .images
        .add_recipe_image(recipe_id, &image)
        .await
        .map_err(ResponseError::Internal)?;

    if !recipe.has_image {
        recipe.has_image = true;
        state
            .db
            .update_recipe(&recipe)
            .await
            .map_err(ResponseError::Internal)?;
    }

    Ok(HttpResponse::Ok().into())
}

#[get("/recipes/{recipe_id}/image")]
async fn get_recipe_image(
    state: web::Data<AppState>,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let recipe_id = path.into_inner();

    let recipe = state
        .db
        .get_recipe(recipe_id)
        .await
        .map_err(ResponseError::Internal)?
        .ok_or(ResponseError::RecipeNotFound(recipe_id))?;

    if !recipe.has_image {
        return Err(ResponseError::RecipeImageNotFound(recipe_id).into());
    }

    let image = state
        .images
        .get_recipe_image(recipe_id)
        .await
        .map_err(ResponseError::Internal)?;

    Ok(HttpResponse::Ok().body(image))
}

#[delete("/recipes/{recipe_id}/image")]
async fn delete_recipe_image(
    state: web::Data<AppState>,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let recipe_id = path.into_inner();

    let recipe = state
        .db
        .get_recipe(recipe_id)
        .await
        .map_err(ResponseError::Internal)?
        .ok_or(ResponseError::RecipeNotFound(recipe_id))?;

    if recipe.has_image {
        state
            .db
            .update_recipe_has_image(recipe_id, false)
            .await
            .map_err(ResponseError::Internal)?;
    }

    state
        .images
        .delete_recipe_image(recipe_id)
        .await
        .map_err(ResponseError::Internal)?;

    Ok(HttpResponse::Ok().into())
}
