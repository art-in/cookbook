use crate::diesel::prelude::*;
use crate::models::recipe::Recipe;
use diesel::pg::PgConnection;
use std::io::stdout;
use std::path::Path;
use std::vec::Vec;

pub mod schema;

pub fn connect(database_url: &String) -> PgConnection {
    PgConnection::establish(database_url).expect(&format!(
        "Failed to connect to database at {}",
        database_url
    ))
}

pub fn run_migrations(connection: &diesel::PgConnection) {
    diesel_migrations::run_pending_migrations_in_directory(
        connection,
        Path::new("./server/src/storage/db/migrations"),
        &mut stdout(),
    )
    .expect("Failed to run db migrations");
}

pub fn get_recipes(connection: &PgConnection) -> Vec<Recipe> {
    use schema::recipes::dsl::*;

    let results = recipes
        .limit(5)
        .load::<Recipe>(connection)
        .expect("Failed to load recipes");

    results
}
