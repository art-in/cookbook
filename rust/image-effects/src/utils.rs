use image::{DynamicImage, ImageBuffer};

pub fn to_dyn_image(image: Vec<u8>, width: u32, height: u32) -> DynamicImage {
    let img_buffer = ImageBuffer::from_vec(width, height, image).unwrap();
    let dyn_image = image::ImageRgba8(img_buffer);
    dyn_image
}

pub struct Rgb {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

pub fn square_distance(color1: Rgb, color2: Rgb) -> i32 {
    let (r1, g1, b1) = (color1.r as i32, color1.g as i32, color1.b as i32);
    let (r2, g2, b2) = (color2.r as i32, color2.g as i32, color2.b as i32);
    return i32::pow(r1 - r2, 2) + i32::pow(g1 - g2, 2) + i32::pow(b1 - b2, 2);
}
