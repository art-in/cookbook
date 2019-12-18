use actix_files as fs;
use actix_web::{middleware, web, App, HttpServer};
use diesel::pg::PgConnection;
use diesel::r2d2;
use listenfd::ListenFd;

mod api;
pub mod utils;

pub type Pool = r2d2::Pool<r2d2::ConnectionManager<PgConnection>>;

struct AppState {
    pool: Pool,
    images_folder: String,
}

pub async fn connect(url: &str, statics_folder: String, images_folder: String, pool: Pool) {
    let mut listenfd = ListenFd::from_env();

    let state = web::Data::new(AppState {
        pool: pool,
        images_folder: images_folder,
    });

    let mut server = HttpServer::new(move || {
        App::new()
            .register_data(state.clone())
            .wrap(middleware::Logger::new(r#""%r" - %s - %Ts"#))
            .wrap(middleware::Compress::default())
            .service(api::register())
            .service(fs::Files::new("/", &statics_folder).index_file("index.html"))
    });

    // reuse same socket on auto-reloads
    server = if let Some(l) = listenfd.take_tcp_listener(0).unwrap() {
        server.listen(l).unwrap()
    } else {
        server.bind(url).unwrap()
    };

    info!("Listening on {}", url);

    server.shutdown_timeout(1).start().await.unwrap();
}
