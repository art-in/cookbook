use actix_web::http::StatusCode;

#[derive(Debug, derive_more::Display)]
pub enum ResponseError {
    #[display(fmt = "internal server error")]
    Internal(anyhow::Error),

    #[display(fmt = "recipe with id '{}' was not found", _0)]
    RecipeNotFound(i32),

    #[display(fmt = "image for recipe with id '{}' was not found", _0)]
    RecipeImageNotFound(i32),
}

impl actix_web::error::ResponseError for ResponseError {
    fn status_code(&self) -> StatusCode {
        match *self {
            ResponseError::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ResponseError::RecipeNotFound(_) => StatusCode::NOT_FOUND,
            ResponseError::RecipeImageNotFound(_) => StatusCode::NOT_FOUND,
        }
    }
}
