use image::{DynamicImage, ImageBuffer};

pub fn to_dyn_image(image: Vec<u8>, width: u32, height: u32) -> DynamicImage {
    let img_buffer = ImageBuffer::from_vec(width, height, image).unwrap();
    let dyn_image = image::ImageRgba8(img_buffer);
    dyn_image
}
