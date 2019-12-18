pub type BlockingError<T> = actix_web::error::BlockingError<T>;

/// Runs blocking operation on actix thread pool.
/// Helps to avoid blocking thread on main server workers pool.
///
/// Use cases:
/// 1. For diesel queries, as diesel currently does not support async:
///    https://github.com/diesel-rs/diesel/issues/399
/// 2. For std lib IO (eg. fs) operations, as entire std lib is currently blocking.
///    Not using async-std to avoid new dependency
pub async fn block<F, I, E>(f: F) -> Result<I, BlockingError<E>>
where
    F: FnOnce() -> Result<I, E> + Send + 'static,
    I: Send + 'static,
    E: Send + std::fmt::Debug + 'static,
{
    actix_web::web::block(f).await
}
