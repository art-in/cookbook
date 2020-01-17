use crate::storage::utils::BlockingError;
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

// TODO: how to get rid of map_err_to_resp() calls on results? actix docs
// suggest implementing ResponseError trait, but i cannot impl ResponseError
// for std:Result, since nor trait nor struct is defined in local crate.

pub trait MapResultErrorToHttpResponse<T> {
    /// maps result error to http response with appropriate status code and
    /// error message in body
    fn map_err_to_resp(self) -> Result<T, HttpResponse>;
}

impl<T, E: IntoHttpResponse> MapResultErrorToHttpResponse<T> for Result<T, E> {
    fn map_err_to_resp(self) -> Result<T, HttpResponse> {
        self.map_err(|e| e.into_http_response())
    }
}

pub trait IntoHttpResponse {
    fn into_http_response(&self) -> HttpResponse;
}

impl IntoHttpResponse for BlockingError<diesel::result::Error> {
    fn into_http_response(&self) -> HttpResponse {
        match &self {
            BlockingError::Error(e) => {
                warn!("Failed to run database query: {}", e);
                HttpResponse::NotFound().body("not found")
            }
            _ => {
                error!("Failed to run database query: {}", self);
                HttpResponse::InternalServerError().body("internal server error")
            }
        }
    }
}

impl IntoHttpResponse for BlockingError<std::io::Error> {
    fn into_http_response(&self) -> HttpResponse {
        match &self {
            BlockingError::Error(e) => {
                warn!("Failed to run IO operation: {}", e);
                HttpResponse::NotFound().body("not found")
            }
            _ => {
                error!("Failed to run IO operation: {}", self);
                HttpResponse::InternalServerError().body("internal server error")
            }
        }
    }
}

impl IntoHttpResponse for actix_multipart::MultipartError {
    fn into_http_response(&self) -> HttpResponse {
        warn!("Failed to parse multipart form data: {}", self);
        HttpResponse::BadRequest().body("invalid multipart form data")
    }
}
