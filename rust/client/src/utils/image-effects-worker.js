import * as imageEffects from 'image-effects';

// set hook to show pretty rust panics in browser console
imageEffects.set_panic_hook();

self.addEventListener('message', e => {
  const {effectType, image} = e.data;

  // wrapping into typed array since naked ArrayBuffer can't be passed to wasm
  // https://github.com/rustwasm/wasm-bindgen/issues/1961
  const imageArray = new Uint8ClampedArray(image.buffer);

  console.time('image-effect');

  try {
    const updatedArray = imageEffects[effectType](
      imageArray,
      image.width,
      image.height
    );

    console.timeEnd('image-effect');

    self.postMessage(
      {resultCode: 'success', effectType, image: {buffer: updatedArray.buffer}},
      [updatedArray.buffer]
    );
  } catch (e) {
    self.postMessage({resultCode: 'fail', effectType, error: e});
  }
});
