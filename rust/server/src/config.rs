use dotenv;
use serde::Deserialize;
use std::env;
use std::fs::read_to_string;

#[derive(Clone, Deserialize)]
pub struct Config {
    pub web: Web,
    pub storage: Storage,
}

#[derive(Clone, Deserialize)]
pub struct Web {
    pub url: String,
    pub statics_folder: String,
}

#[derive(Clone, Deserialize)]
pub struct Storage {
    pub database_url: String,
    pub images_folder: String,
}

impl Config {
    pub fn from_file(filename: &str) -> Self {
        let mut config =
            toml::from_str::<Self>(&read_to_string(filename).expect("Failed to read config file"))
                .expect("Failed to parse config file");

        // read database url from .env file instead of config.toml,
        // since we need to share it with diesel_cli through .env
        dotenv::from_path(".env").ok();
        config.storage.database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        config
    }
}
