use super::utils::{IntoHttpResponse, ParseParam};
use super::AppState;
use crate::models::recipe::{NewRecipe, Recipe};
use crate::storage;
use actix_multipart::Multipart;
use actix_web::{delete, get, post, put, web, Error, HttpRequest, HttpResponse, Scope};
use serde::Deserialize;

static DEFAULT_SORT_PROP: &str = "id";
static DEFAULT_SORT_DIR: &str = "asc";
static DEFAULT_PAGE_OFFSET: i32 = 0;
static DEFAULT_PAGE_LIMIT: i32 = 1000;

pub fn register() -> Scope {
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

#[derive(Deserialize)]
struct GetRecipesParams {
    sp: Option<String>, // sort prop
    sd: Option<String>, // sort dir
    po: Option<i32>,    // page offset
    pl: Option<i32>,    // page limit
}

// TODO: is it possible to get rid of `.map_err(|e| e.into_http_response())`s?

#[get("/recipes")]
async fn get_recipes(
    data: web::Data<AppState>,
    query: web::Query<GetRecipesParams>,
) -> Result<HttpResponse, Error> {
    let recipes = storage::db::get_recipes(
        &data.pool,
        query.sp.clone().unwrap_or(String::from(DEFAULT_SORT_PROP)),
        query.sd.clone().unwrap_or(String::from(DEFAULT_SORT_DIR)),
        query.po.unwrap_or(DEFAULT_PAGE_OFFSET),
        query.pl.unwrap_or(DEFAULT_PAGE_LIMIT),
    )
    .await
    .map_err(|e| e.into_http_response())?;

    Ok(HttpResponse::Ok().json(recipes))
}

#[get("/recipes/{recipe_id}")]
async fn get_recipe(data: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, Error> {
    let recipe_id: i32 = req.parse_param("recipe_id")?;

    let recipe = storage::db::get_recipe(&data.pool, recipe_id)
        .await
        .map_err(|e| e.into_http_response())?;

    Ok(HttpResponse::Ok().json(recipe))
}

#[post("/recipes")]
async fn post_recipe(
    data: web::Data<AppState>,
    body: web::Json<NewRecipe>,
) -> Result<HttpResponse, Error> {
    let recipe = body.into_inner();

    let recipe_id = storage::db::add_recipe(&data.pool, recipe)
        .await
        .map_err(|e| e.into_http_response())?;

    Ok(HttpResponse::Ok().body(recipe_id.to_string()))
}

#[delete("/recipes/{recipe_id}")]
async fn delete_recipe(data: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, Error> {
    let recipe_id: i32 = req.parse_param("recipe_id")?;

    let recipe = storage::db::get_recipe(&data.pool, recipe_id)
        .await
        .map_err(|e| e.into_http_response())?;

    storage::db::delete_recipe(&data.pool, recipe_id)
        .await
        .map_err(|e| e.into_http_response())?;

    if recipe.has_image {
        storage::images::delete_recipe_image(&data.images_folder, recipe_id)
            .await
            .map_err(|e| e.into_http_response())?;
    }

    Ok(HttpResponse::Ok().into())
}

#[put("/recipes/{recipe_id}")]
async fn put_recipe(
    data: web::Data<AppState>,
    req: HttpRequest,
    body: web::Json<Recipe>,
) -> Result<HttpResponse, Error> {
    let recipe_id: i32 = req.parse_param("recipe_id")?;
    let mut recipe = body.into_inner();
    recipe.id = recipe_id;

    let updated_recipe = storage::db::update_recipe(&data.pool, recipe)
        .await
        .map_err(|e| e.into_http_response())?;

    Ok(HttpResponse::Ok().json(updated_recipe))
}

#[post("/recipes/{recipe_id}/image")]
async fn post_recipe_image(
    data: web::Data<AppState>,
    req: HttpRequest,
    payload: Multipart,
) -> Result<HttpResponse, Error> {
    let recipe_id: i32 = req.parse_param("recipe_id")?;

    let mut recipe = storage::db::get_recipe(&data.pool, recipe_id)
        .await
        .map_err(|e| e.into_http_response())?;

    storage::images::create_recipe_image(&data.images_folder, recipe_id, payload).await?;

    if !recipe.has_image {
        recipe.has_image = true;
        storage::db::update_recipe(&data.pool, recipe)
            .await
            .map_err(|e| e.into_http_response())?;
    }

    Ok(HttpResponse::Ok().into())
}

#[get("/recipes/{recipe_id}/image")]
async fn get_recipe_image(
    data: web::Data<AppState>,
    req: HttpRequest,
) -> Result<actix_files::NamedFile, Error> {
    let recipe_id: i32 = req.parse_param("recipe_id")?;

    let file = storage::images::get_recipe_image(&data.images_folder, recipe_id)
        .await
        .map_err(|e| e.into_http_response())?;

    Ok(file)
}

#[delete("/recipes/{recipe_id}/image")]
async fn delete_recipe_image(
    data: web::Data<AppState>,
    req: HttpRequest,
) -> Result<HttpResponse, Error> {
    let recipe_id: i32 = req.parse_param("recipe_id")?;

    let mut recipe = storage::db::get_recipe(&data.pool, recipe_id)
        .await
        .map_err(|e| e.into_http_response())?;

    storage::images::delete_recipe_image(&data.images_folder, recipe_id)
        .await
        .map_err(|e| e.into_http_response())?;

    recipe.has_image = false;
    storage::db::update_recipe(&data.pool, recipe)
        .await
        .map_err(|e| e.into_http_response())?;

    Ok(HttpResponse::Ok().into())
}
