use anyhow::{Context, Result};
use std::env;

#[derive(Clone)]
pub struct Config {
    pub http_server_url: String,
    pub db_url: String,
    pub images_folder: String,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        Ok(Config {
            http_server_url: get_env_var("HTTP_SERVER_URL")?,
            db_url: get_env_var("DATABASE_URL")?,
            images_folder: get_env_var("IMAGES_FOLDER")?,
        })
    }
}

fn get_env_var(key: &str) -> Result<String> {
    env::var(key).with_context(|| format!("failed to fetch environment variable: {}", key))
}
