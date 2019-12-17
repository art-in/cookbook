use super::utils::{IntoHttpResponse, ParseParam};
use crate::models::recipe::{NewRecipe, Recipe};
use crate::storage;
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
}

#[derive(Deserialize)]
struct GetRecipesParams {
    sp: Option<String>, // sort prop
    sd: Option<String>, // sort dir
    po: Option<i32>,    // page offset
    pl: Option<i32>,    // page limit
}

#[get("/recipes")]
async fn get_recipes(
    data: web::Data<super::AppState>,
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
async fn get_recipe(
    data: web::Data<super::AppState>,
    req: HttpRequest,
) -> Result<HttpResponse, Error> {
    let recipe_id: i32 = req.parse_param("recipe_id")?;

    let recipe = storage::db::get_recipe(&data.pool, recipe_id)
        .await
        .map_err(|e| e.into_http_response())?;

    Ok(HttpResponse::Ok().json(recipe))
}

#[post("/recipes")]
async fn post_recipe(
    data: web::Data<super::AppState>,
    body: web::Json<NewRecipe>,
) -> Result<HttpResponse, Error> {
    let recipe = body.into_inner();

    let recipe_id = storage::db::add_recipe(&data.pool, recipe)
        .await
        .map_err(|e| e.into_http_response())?;

    Ok(HttpResponse::Ok().body(recipe_id.to_string()))
}

#[delete("/recipes/{recipe_id}")]
async fn delete_recipe(
    data: web::Data<super::AppState>,
    req: HttpRequest,
) -> Result<HttpResponse, Error> {
    let recipe_id: i32 = req.parse_param("recipe_id")?;

    storage::db::delete_recipe(&data.pool, recipe_id)
        .await
        .map_err(|e| e.into_http_response())?;

    Ok(HttpResponse::Ok().body(""))
}

#[put("/recipes/{recipe_id}")]
async fn put_recipe(
    data: web::Data<super::AppState>,
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
