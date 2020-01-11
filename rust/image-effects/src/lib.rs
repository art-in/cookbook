use image::{GenericImage, GenericImageView};
use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, ImageData};

mod helpers;

#[wasm_bindgen]
pub fn set_panic_hook() {
    // https://github.com/rustwasm/console_error_panic_hook
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// Get the ImageData from a 2D canvas context
#[wasm_bindgen]
pub fn get_image_data(canvas: &HtmlCanvasElement, ctx: &CanvasRenderingContext2d) -> Vec<u8> {
    set_panic_hook();
    let width = canvas.width();
    let height = canvas.height();

    ctx.get_image_data(0.0, 0.0, width as f64, height as f64)
        .unwrap()
        .data()
        .to_vec()
}

#[wasm_bindgen]
pub fn open_image(canvas: HtmlCanvasElement, ctx: CanvasRenderingContext2d) -> Image {
    let raw_pixels = get_image_data(&canvas, &ctx);

    Image {
        raw_pixels: raw_pixels,
        width: canvas.width(),
        height: canvas.height(),
    }
}

/// Place a PhotonImage onto a 2D canvas.
#[wasm_bindgen]
pub fn put_image_data(
    canvas: HtmlCanvasElement,
    ctx: CanvasRenderingContext2d,
    mut new_image: Image,
) {
    // Convert the raw pixels back to an ImageData object.
    let new_img_data = ImageData::new_with_u8_clamped_array_and_sh(
        Clamped(&mut new_image.raw_pixels),
        canvas.width(),
        canvas.height(),
    );

    // Place the new imagedata onto the canvas
    ctx.put_image_data(&new_img_data.unwrap(), 0.0, 0.0)
        .unwrap();
}

#[wasm_bindgen]
pub fn grayscale(mut image: &mut Image) {
    let mut img = helpers::dyn_image_from_raw(&image);
    let (width, height) = img.dimensions();

    for x in 0..width {
        for y in 0..height {
            let px = img.get_pixel(x, y);
            let (r_val, g_val, b_val) = (px.data[0] as u32, px.data[1] as u32, px.data[2] as u32);
            let mut avg = ((r_val + g_val + b_val) / 3) as u8;
            if avg >= 255 {
                avg = 255
            }

            img.put_pixel(x, y, image::Rgba([avg, avg, avg, 255]));
        }
    }
    let raw_pixels = img.raw_pixels();
    image.raw_pixels = raw_pixels;
}

#[wasm_bindgen]
pub struct Image {
    raw_pixels: Vec<u8>,
    width: u32,
    height: u32,
}
