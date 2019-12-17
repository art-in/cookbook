use crate::storage::db::utils::{BlockingDieselError, BlockingError, DieselError};
use actix_web::{Error, HttpRequest, HttpResponse};

pub trait ParseParam {
    fn parse_param(&self, key: &str) -> Result<i32, Error>;
}

impl ParseParam for HttpRequest {
    fn parse_param(&self, key: &str) -> Result<i32, Error> {
        let res: i32 = self.match_info().get(key).unwrap().parse().map_err(|e| {
            warn!("Failed to parse path parameter: {}", e);
            HttpResponse::BadRequest().body("invalid path parameter")
        })?;

        Ok(res)
    }
}

pub trait IntoHttpResponse {
    fn into_http_response(&self) -> HttpResponse;
}

impl IntoHttpResponse for BlockingDieselError {
    fn into_http_response(&self) -> HttpResponse {
        match &self {
            BlockingError::Error(DieselError::NotFound) => {
                HttpResponse::NotFound().body("not found")
            }
            _ => HttpResponse::InternalServerError().body("internal server error"),
        }
    }
}
