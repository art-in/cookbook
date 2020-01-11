#[macro_use]
extern crate diesel;
#[macro_use]
extern crate log;

use config::Config;

mod config;
mod models;
mod routes;
mod storage;

#[actix_rt::main]
async fn main() {
    // enable logging
    std::env::set_var("RUST_LOG", "actix_web=debug,server=trace");
    std::env::set_var("RUST_BACKTRACE", "1");
    env_logger::init();

    let config = Config::from_file("config.toml");

    let pool = storage::db::connect(&config.storage.database_url);
    storage::db::run_migrations(&pool.get().unwrap());

    routes::connect(
        &config.web.url,
        config.web.statics_folder,
        config.storage.images_folder,
        pool,
    )
    .await;
}
