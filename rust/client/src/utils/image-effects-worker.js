import * as imageEffects from 'image-effects';

// set hook to show pretty rust panics in browser console
if (process.env.NODE_ENV === 'development') {
  imageEffects.set_panic_hook();
}

self.addEventListener('message', e => {
  try {
    const {effectType, image} = e.data;

    // wrapping into typed array since naked ArrayBuffer can't be passed to wasm
    // https://github.com/rustwasm/wasm-bindgen/issues/1961
    const imageArray = new Uint8ClampedArray(image.buffer);

    console.time('image-effect');

    const array = imageEffects[effectType](
      imageArray,
      image.width,
      image.height
    );

    console.timeEnd('image-effect');

    self.postMessage(
      {resultCode: 'success', effectType, image: {buffer: array.buffer}},
      [array.buffer]
    );
  } catch (error) {
    console.error(error);
    self.postMessage({
      resultCode: 'fail',
      effectType: e.data.effectType,
      error
    });
  }
});
