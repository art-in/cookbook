use std::io::stdout;
use std::path::Path;

use super::utils::{block, BlockingError};
use crate::diesel::prelude::*;
use crate::models::recipe::{NewRecipe, Recipe};
use crate::routes::Pool;
use diesel::pg::PgConnection;
use diesel::r2d2::{self, ConnectionManager};
use entity_subset::EntitySubset;

static MIGRATIONS_DIR: &str = "./server/src/storage/db/migrations";

pub mod entity_subset;
pub mod schema;

pub fn connect(database_url: &String) -> r2d2::Pool<r2d2::ConnectionManager<PgConnection>> {
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create database connection pool")
}

pub fn run_migrations(connection: &diesel::PgConnection) {
    diesel_migrations::run_pending_migrations_in_directory(
        connection,
        Path::new(MIGRATIONS_DIR),
        &mut stdout(),
    )
    .expect("Failed to run db migrations");
}

pub async fn get_recipes(
    pool: &Pool,
    sort_prop: String,
    sort_dir: String,
    page_offset: i32,
    page_limit: i32,
) -> Result<EntitySubset<Recipe>, BlockingError<diesel::result::Error>> {
    use schema::recipes::dsl::*;
    let connection = pool.get().unwrap();

    block(move || {
        let mut query = recipes.into_boxed();

        query = match sort_prop.as_str() {
            "name" => {
                if sort_dir == "asc" {
                    query.order_by(name.asc())
                } else {
                    query.order_by(name.desc())
                }
            }
            "complexity" => {
                if sort_dir == "asc" {
                    query.order_by(complexity.asc())
                } else {
                    query.order_by(complexity.desc())
                }
            }
            "popularity" => {
                if sort_dir == "asc" {
                    query.order_by(popularity.asc())
                } else {
                    query.order_by(popularity.desc())
                }
            }
            _ => {
                if sort_dir == "asc" {
                    query.order_by(id.asc())
                } else {
                    query.order_by(id.desc())
                }
            }
        };

        let items = query
            .offset(page_offset as i64)
            .limit(page_limit as i64)
            .load::<Recipe>(&connection)?;

        let total = recipes.count().get_result(&connection)?;

        Ok(EntitySubset {
            items: items,
            total: total,
        })
    })
    .await
}

pub async fn get_recipe(
    pool: &Pool,
    recipe_id: i32,
) -> Result<Recipe, BlockingError<diesel::result::Error>> {
    use schema::recipes::dsl::*;
    let connection = pool.get().unwrap();

    block(move || recipes.find(recipe_id).first(&connection)).await
}

pub async fn add_recipe(
    pool: &Pool,
    recipe: NewRecipe,
) -> Result<i32, BlockingError<diesel::result::Error>> {
    use schema::recipes;
    let connection = pool.get().unwrap();

    let recipe: Recipe = block(move || {
        diesel::insert_into(recipes::table)
            .values(&recipe)
            .get_result(&connection)
    })
    .await?;

    Ok(recipe.id)
}

pub async fn delete_recipe(
    pool: &Pool,
    recipe_id: i32,
) -> Result<(), BlockingError<diesel::result::Error>> {
    use schema::recipes::dsl::*;
    let connection = pool.get().unwrap();

    block(move || {
        let count = diesel::delete(recipes.filter(id.eq(recipe_id))).execute(&connection)?;

        if count == 0 {
            Err(diesel::result::Error::NotFound)
        } else {
            Ok(())
        }
    })
    .await
}

pub async fn update_recipe(
    pool: &Pool,
    recipe: Recipe,
) -> Result<Recipe, BlockingError<diesel::result::Error>> {
    use schema::recipes::dsl::*;
    let connection = pool.get().unwrap();

    block(move || {
        diesel::update(recipes.filter(id.eq(recipe.id)))
            .set(&recipe)
            .get_result::<Recipe>(&connection)
    })
    .await
}
