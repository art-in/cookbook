use anyhow::{Context, Result};
use std::path::PathBuf;
use tokio::io::AsyncWriteExt;

pub struct Images {
    images_folder: String,
}

impl Images {
    pub fn new(images_folder: &str) -> Self {
        Images {
            images_folder: images_folder.to_owned(),
        }
    }

    fn get_recipe_image_file_path(&self, recipe_id: i32) -> PathBuf {
        [&self.images_folder, &format!("recipe-{}", recipe_id)]
            .iter()
            .collect()
    }

    pub async fn add_recipe_image(&self, recipe_id: i32, image: &[u8]) -> Result<()> {
        let image_path = self.get_recipe_image_file_path(recipe_id);
        let mut file = tokio::fs::File::create(image_path).await?;
        file.write_all(image).await?;
        Ok(())
    }

    pub async fn get_recipe_image(&self, recipe_id: i32) -> Result<Vec<u8>> {
        let image_path = self.get_recipe_image_file_path(recipe_id);
        Ok(tokio::fs::read(image_path).await?)
    }

    pub async fn delete_recipe_image(&self, recipe_id: i32) -> Result<()> {
        let image_path = self.get_recipe_image_file_path(recipe_id);

        Ok(tokio::fs::remove_file(image_path)
            .await
            .with_context(|| format!("failed to remove image for recipe '{}'", recipe_id))?)
    }
}
