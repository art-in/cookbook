pub type DieselError = diesel::result::Error;
pub type BlockingError<T> = actix_threadpool::BlockingError<T>;
pub type BlockingDieselError = BlockingError<DieselError>;

/// Runs blocking diesel query on actix thread pool.
/// Helps to avoid blocking thread on main server workers pool.
///
/// Diesel currently does not support async:
/// https://github.com/diesel-rs/diesel/issues/399
pub async fn block<F, I>(f: F) -> Result<I, BlockingDieselError>
where
    F: FnOnce() -> Result<I, diesel::result::Error> + Send + 'static,
    I: Send + 'static,
{
    actix_web::web::block(f).await.map_err(|e| {
        match e {
            BlockingError::Error(DieselError::NotFound) => {
                warn!("Failed to run database query: {}", e)
            }
            _ => error!("Failed to run database query: {}", e),
        }
        e
    })
}
