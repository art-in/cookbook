#[macro_use]
extern crate diesel_migrations;

use config::Config;

mod config;
mod http_server;
mod models;
mod storage;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init();

    let config = Config::from_env().expect("failed to create config from environment variables");

    storage::setup(&config).expect("failed to setup storage");
    http_server::listen(&config).await
}
