import * as imageEffects from 'image-effects';

// set hook to show pretty rust panics in browser console
imageEffects.set_panic_hook();

self.addEventListener('message', e => {
  const {effectType, image} = e.data;

  // wrapping into typed array since naked buffer can't be passed to wasm
  // https://github.com/rustwasm/wasm-bindgen/issues/1961
  const imageArray = new Uint8ClampedArray(image.buffer);

  switch (effectType) {
    case 'grayscale': {
      console.time('imageEffect');

      // TODO: more effects
      const updatedArray = imageEffects.grayscale(
        imageArray,
        image.width,
        image.height
      );

      console.timeEnd('imageEffect');

      self.postMessage(updatedArray.buffer, [updatedArray.buffer]);
      break;
    }
    default:
      throw Error(`Unknown effect type '${effectType}'`);
  }
});
