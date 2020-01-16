const IMAGE_MEDIA_TYPE = 'image/jpeg';

/**
 * Extracts image BLOB from canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @return {Blob}
 */
export default function getImageBlobFromCanvas(canvas) {
  // convert canvas internal pixeled image representation to target format.
  // not using `canvas.toBlob()` because it has weird callback api and is not
  // supported by Edge.
  const dataUrl = canvas.toDataURL(IMAGE_MEDIA_TYPE);
  const base64 = dataUrl.split(',')[1];

  // convert base64 to blob
  const binaryString = atob(base64);
  const binaryArray = [];

  for (let i = 0; i < binaryString.length; i++) {
    binaryArray.push(binaryString.charCodeAt(i));
  }

  // TODO: extract media type from data url, since browser may not support
  // media type specified in toDataURL and use another one it supports
  return new Blob([new Uint8Array(binaryArray)], {type: IMAGE_MEDIA_TYPE});
}
