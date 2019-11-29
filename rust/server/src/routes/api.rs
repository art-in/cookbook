use actix_web::{get, web, HttpResponse, Scope};

pub fn setup() -> Scope {
    web::scope("/api").service(get_recipes)
}

#[get("/recipes")]
fn get_recipes(data: web::Data<super::AppState>) -> HttpResponse {
    let db_connection = data.db_connection.lock().unwrap();
    let recipes = crate::storage::db::get_recipes(&db_connection);

    let mut res = String::new();

    for r in recipes.iter() {
        res += &r.name;
        res += "\n";
    }

    HttpResponse::Ok().body(res)
}
