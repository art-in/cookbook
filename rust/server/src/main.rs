#[macro_use]
extern crate diesel;

use config::Config;

mod config;
mod models;
mod routes;
mod storage;

fn main() {
    // enable logging
    std::env::set_var("RUST_LOG", "actix_web=debug");
    std::env::set_var("RUST_BACKTRACE", "1");
    env_logger::init();

    let config = Config::from_file("./server/config.toml");

    let db_connection = storage::db::connect(&config.database.url);
    storage::db::run_migrations(&db_connection);

    routes::connect(&config.web.url, config.web.statics_folder, db_connection);
}
