use image::{GenericImage, GenericImageView};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn grayscale(image_data: Vec<u8>, width: u32, height: u32) -> Vec<u8> {
    let mut image = crate::utils::to_dyn_image(image_data, width, height);

    for x in 0..width {
        for y in 0..height {
            let px = image.get_pixel(x, y);
            let (r_val, g_val, b_val) = (px.data[0] as u32, px.data[1] as u32, px.data[2] as u32);
            let mut avg = ((r_val + g_val + b_val) / 3) as u8;
            if avg >= 255 {
                avg = 255
            }

            image.put_pixel(x, y, image::Rgba([avg, avg, avg, 255]));
        }
    }
    image.raw_pixels()
}
