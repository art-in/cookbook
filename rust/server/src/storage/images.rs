use std::io::Write;

use crate::routes::utils::IntoHttpResponse;
use crate::storage::utils::{block, BlockingError};
use actix_multipart::Multipart;
use actix_web::Error;
use futures::StreamExt;

pub async fn create_recipe_image(
    images_folder: &String,
    recipe_id: i32,
    mut payload: Multipart,
) -> Result<(), Error> {
    // iterate over multipart stream
    while let Some(item) = payload.next().await {
        let mut field = item.map_err(|e| e.into_http_response())?;

        let filepath = format!("{}{}", images_folder, recipe_id);

        let mut f = block(|| std::fs::File::create(filepath))
            .await
            .map_err(|e| e.into_http_response())?;

        while let Some(chunk) = field.next().await {
            let data = chunk.map_err(|e| e.into_http_response())?;
            f = block(move || f.write_all(&data).map(|_| f))
                .await
                .map_err(|e| e.into_http_response())?;
        }
    }

    Ok(())
}

pub async fn get_recipe_image(
    images_folder: &String,
    recipe_id: i32,
) -> Result<actix_files::NamedFile, BlockingError<std::io::Error>> {
    let filepath = format!("{}{}", images_folder, recipe_id);
    block(move || actix_files::NamedFile::open(filepath)).await
}

pub async fn delete_recipe_image(
    images_folder: &String,
    recipe_id: i32,
) -> Result<(), BlockingError<std::io::Error>> {
    let filepath = format!("{}{}", images_folder, recipe_id);
    block(move || std::fs::remove_file(filepath)).await?;
    Ok(())
}
