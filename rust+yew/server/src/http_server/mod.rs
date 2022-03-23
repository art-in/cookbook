use crate::{config::Config, storage};
use actix_web::{middleware, App, HttpServer};
use anyhow::Result;
use std::sync::Arc;

mod api;
mod error;

pub struct AppState {
    db: storage::db::Db,
    images: storage::images::Images,
}

impl AppState {
    async fn from_config(cfg: Arc<Config>) -> Result<AppState> {
        Ok(AppState {
            db: storage::db::Db::connect(&cfg.db_url).await?,
            images: storage::images::Images::new(&cfg.images_folder),
        })
    }
}

pub async fn listen(cfg: &Config) -> std::io::Result<()> {
    log::info!(
        "starting http server to listen at: {}",
        &cfg.http_server_url
    );

    // copy config to heap to be able to distribute pointer to several worker threads
    let cfg_ptr = Arc::new(cfg.clone());

    HttpServer::new(move || {
        let cfg_ptr = cfg_ptr.clone();

        App::new()
            // create separate instances of application state inside each worker
            .data_factory(move || AppState::from_config(cfg_ptr.clone()))
            .wrap(middleware::Logger::default())
            .service(api::scope())
    })
    .bind(&cfg.http_server_url)?
    .run()
    .await
}
