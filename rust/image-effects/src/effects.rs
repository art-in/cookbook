use image::{GenericImage, GenericImageView};
use wasm_bindgen::prelude::*;

use crate::utils::Rgb;

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

#[wasm_bindgen]
pub fn solarize(image_data: Vec<u8>, width: u32, height: u32) -> Vec<u8> {
    let mut image = crate::utils::to_dyn_image(image_data, width, height);

    for x in 0..width {
        for y in 0..height {
            let mut px = image.get_pixel(x, y);
            if 200 as i32 - px.data[0] as i32 > 0 {
                px.data[0] = 200 - px.data[0];
            }
            image.put_pixel(x, y, px);
        }
    }

    image.raw_pixels()
}

// TODO: this one crashes for pictures of certain sizes (600x337)
#[wasm_bindgen]
pub fn halftone(image_data: Vec<u8>, width: u32, height: u32) -> Vec<u8> {
    let mut image = crate::utils::to_dyn_image(image_data, width, height);

    for x in (0..width).step_by(2 as usize) {
        for y in (0..height).step_by(2 as usize) {
            let mut px1 = image.get_pixel(x, y);
            let mut px2 = image.get_pixel(x, y + 1);
            let mut px3 = image.get_pixel(x + 1, y);
            let mut px4 = image.get_pixel(x + 1, y + 1);

            let gray1 = (px1[0] as f64 * 0.299) + (px1[1] as f64 * 0.587) + (px1[2] as f64 * 0.114);
            let gray2 = (px2[0] as f64 * 0.299) + (px2[1] as f64 * 0.587) + (px2[2] as f64 * 0.114);
            let gray3 = (px3[0] as f64 * 0.299) + (px3[1] as f64 * 0.587) + (px3[2] as f64 * 0.114);
            let gray4 = (px4[0] as f64 * 0.299) + (px4[1] as f64 * 0.587) + (px4[2] as f64 * 0.114);

            let sat = (gray1 + gray2 + gray3 + gray4) / 4.0;

            if sat > 200.0 {
                px1.data[0] = 255;
                px1.data[1] = 255;
                px1.data[2] = 255;

                px2.data[0] = 255;
                px2.data[1] = 255;
                px2.data[2] = 255;

                px3.data[0] = 255;
                px3.data[1] = 255;
                px3.data[2] = 255;

                px4.data[0] = 255;
                px4.data[1] = 255;
                px4.data[2] = 255;
            } else if sat > 159.0 {
                px1.data[0] = 255;
                px1.data[1] = 255;
                px1.data[2] = 255;

                px2.data[0] = 0;
                px2.data[1] = 0;
                px2.data[2] = 0;

                px3.data[0] = 255;
                px3.data[1] = 255;
                px3.data[2] = 255;

                px4.data[0] = 255;
                px4.data[1] = 255;
                px4.data[2] = 255;
            } else if sat > 95.0 {
                px1.data[0] = 255;
                px1.data[1] = 255;
                px1.data[2] = 255;

                px2.data[0] = 0;
                px2.data[1] = 0;
                px2.data[2] = 0;

                px3.data[0] = 0;
                px3.data[1] = 0;
                px3.data[2] = 0;

                px4.data[0] = 255;
                px4.data[1] = 255;
                px4.data[2] = 255;
            } else if sat > 32.0 {
                px1.data[0] = 0;
                px1.data[1] = 0;
                px1.data[2] = 0;

                px2.data[0] = 255;
                px2.data[0] = 255;
                px2.data[0] = 255;

                px3.data[0] = 0;
                px3.data[1] = 0;
                px3.data[2] = 0;
                px4.data[0] = 0;
                px4.data[1] = 0;
                px4.data[2] = 0;
            } else {
                px1.data[0] = 0;
                px1.data[1] = 0;
                px1.data[2] = 0;
                px2.data[0] = 0;
                px2.data[1] = 0;
                px2.data[2] = 0;
                px3.data[0] = 0;
                px3.data[1] = 0;
                px3.data[2] = 0;

                px4.data[0] = 0;
                px4.data[1] = 0;
                px4.data[2] = 0;
            }

            image.put_pixel(x, y, px1);
            // img.put_pixel(x, y + 1, px2);
        }
    }

    image.raw_pixels()
}

#[wasm_bindgen]
pub fn primary(image_data: Vec<u8>, width: u32, height: u32) -> Vec<u8> {
    let mut image = crate::utils::to_dyn_image(image_data, width, height);

    for x in 0..width {
        for y in 0..height {
            let mut px = image.get_pixel(x, y);

            let mut r_val = px.data[0];
            let mut g_val = px.data[1];
            let mut b_val = px.data[2];

            if r_val > 128 {
                r_val = 255;
            } else {
                r_val = 0;
            }

            if g_val > 128 {
                g_val = 255;
            } else {
                g_val = 0;
            }

            if b_val > 128 {
                g_val = 255;
            } else {
                b_val = 0;
            }

            px.data[0] = r_val;
            px.data[1] = g_val;
            px.data[2] = b_val;

            image.put_pixel(x, y, px);
        }
    }

    image.raw_pixels()
}

#[wasm_bindgen]
pub fn colorize(image_data: Vec<u8>, width: u32, height: u32) -> Vec<u8> {
    let mut image = crate::utils::to_dyn_image(image_data, width, height);
    let threshold = 220;

    for x in 0..width {
        for y in 0..height {
            let mut px = image.get_pixel(x, y);
            let px_as_rgb = Rgb {
                r: px.data[0],
                g: px.data[1],
                b: px.data[2],
            };

            let baseline_color = Rgb {
                r: 0,
                g: 255,
                b: 255,
            };

            let square_distance = crate::utils::square_distance(baseline_color, px_as_rgb);

            let mut r = px.data[0] as f32;
            let mut g = px.data[1] as f32;
            let mut b = px.data[2] as f32;

            if square_distance < i32::pow(threshold, 2) {
                r = r * 0.5;
                g = g * 1.25;
                b = b * 0.5;
            }

            px.data[0] = r as u8;
            px.data[1] = g as u8;
            px.data[2] = b as u8;

            image.put_pixel(x, y, px);
        }
    }

    image.raw_pixels()
}

#[wasm_bindgen]
pub fn sepia(image_data: Vec<u8>, width: u32, height: u32) -> Vec<u8> {
    let mut image = crate::utils::to_dyn_image(image_data, width, height);

    for x in 0..width {
        for y in 0..height {
            let px = image.get_pixel(x, y);
            let (r_val, g_val, b_val) = (px.data[0] as f32, px.data[1] as f32, px.data[2] as f32);
            let avg = 0.3 * r_val + 0.59 * g_val + 0.11 * b_val;

            let new_r = if avg as u32 + 100 < 255 {
                avg as u8 + 100
            } else {
                255
            };
            let new_g = if avg as u32 + 50 < 255 {
                avg as u8 + 50
            } else {
                255
            };
            image.put_pixel(x, y, image::Rgba([new_r, new_g, b_val as u8, 255]));
        }
    }

    image.raw_pixels()
}
