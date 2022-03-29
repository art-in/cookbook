use crate::{config::Config, storage};
use actix_files::Files;
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
            images: storage::images::Images::new(&cfg.images_dir),
        })
    }
}

pub async fn listen(cfg: &Config) -> std::io::Result<()> {
    log::info!(
        "starting http server and listen at: {}",
        &cfg.http_server_url
    );
    log::info!("serving static files from: {}", &cfg.statics_dir);

    // copy config to heap to be able to distribute pointer to several worker threads
    let cfg_ptr = Arc::new(cfg.clone());

    HttpServer::new(move || {
        let cfg_ptr = cfg_ptr.clone();
        let statics_dir = cfg_ptr.statics_dir.clone();

        App::new()
            // create separate instances of application state inside each worker
            .data_factory(move || AppState::from_config(cfg_ptr.clone()))
            .wrap(middleware::Logger::default())
            .wrap(middleware::Compress::default())
            .service(api::scope())
            .service(
                Files::new("/", &statics_dir)
                    .index_file("index.html")
                    .disable_content_disposition(),
            )
    })
    .bind(&cfg.http_server_url)?
    .run()
    .await
}
