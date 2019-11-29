use actix_files as fs;
use actix_web::{get, middleware, web, App, HttpResponse, HttpServer, Result};
use diesel::pg::PgConnection;
use listenfd::ListenFd;
use std::sync::Mutex;

mod api;

struct AppState {
    db_connection: Mutex<PgConnection>,
    statics_folder: String,
}

pub fn connect(url: &str, statics_folder: String, db_connection: PgConnection) {
    let mut listenfd = ListenFd::from_env();

    let state = web::Data::new(AppState {
        db_connection: Mutex::new(db_connection),
        statics_folder: statics_folder,
    });

    let mut server = HttpServer::new(move || {
        App::new()
            .register_data(state.clone())
            .wrap(middleware::Logger::new(r#""%r" - %s - %Ts"#))
            .wrap(middleware::Compress::default())
            .service(index)
            .service(favicon)
            .service(api::setup())
    });

    // reuse same socket on auto-reloads
    server = if let Some(l) = listenfd.take_tcp_listener(0).unwrap() {
        server.listen(l).unwrap()
    } else {
        server.bind(url).unwrap()
    };

    println!("Listening on {}", url);

    server.shutdown_timeout(1).run().unwrap();
}

#[get("/")]
fn index() -> HttpResponse {
    HttpResponse::Ok().body("test")
}

#[get("/favicon")]
fn favicon(data: web::Data<AppState>) -> Result<fs::NamedFile> {
    Ok(fs::NamedFile::open(
        data.statics_folder.clone() + "favicon.ico",
    )?)
}
