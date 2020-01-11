use image::{DynamicImage, ImageBuffer};

/// Convert a Image to a DynamicImage type (struct used by the `image` crate)
pub fn dyn_image_from_raw(photon_image: &crate::Image) -> DynamicImage {
    // convert a vec of raw pixels (as u8s) to a DynamicImage type
    let _len_vec = photon_image.raw_pixels.len() as u128;
    let raw_pixels = &photon_image.raw_pixels;
    let img_buffer =
        ImageBuffer::from_vec(photon_image.width, photon_image.height, raw_pixels.to_vec())
            .unwrap();
    let dynimage = image::ImageRgba8(img_buffer);
    dynimage
}
