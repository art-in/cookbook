use std::fs;

use crate::config::Config;
use anyhow::{Context, Result};

pub mod db;
pub mod images;

pub fn setup(config: &Config) -> Result<()> {
    db::run_migrations(&config.db_url).context("failed to run database migrations")?;
    fs::create_dir_all(&config.images_dir).context("failed to create images dir")?;
    Ok(())
}
