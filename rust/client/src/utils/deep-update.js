/**
 * Updates object deeply and safely.
 * Sub-arrays updated shallowly (replaced).
 *
 * Fails on:
 * - attempt to create new props
 *
 * @example
 * const target = {a: 1, b: 3}
 * updateObject(target, {b: 2})
 * target // {a: 1, b: 2}
 *
 * @example unknown props
 * const target = {a: 1, b: 2}
 * updateObject(target, {c: 3}) // Error
 *
 * @example deep update
 * const target = {nested: {a: 1}}
 * updateObject(target, {nested: {a: 2}})
 * target // {nested: {a: 2}}
 *
 * @template T
 * @param {T} target
 * @param {Partial<T>} source
 * @return {T} updated target
 */
export default function deepUpdate(target, source) {
  for (const prop in source) {
    if (!Object.prototype.hasOwnProperty.call(source, prop)) {
      // ignore prototype props
      continue;
    }

    /** @type {*} */ const targetValue = target[prop];
    /** @type {*} */ const sourceValue = source[prop];

    // do not allow creating new props in target
    if (!Object.prototype.hasOwnProperty.call(target, prop)) {
      throw Error(`Target object does not have property '${prop}' to update`);
    }

    // check types

    // hack-fix js types
    const getType = val =>
      val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val;

    const targetType = getType(targetValue);
    const sourceType = getType(sourceValue);

    // apply update
    if (targetType === 'array' && sourceType === 'array') {
      // replace array
      target[prop] = sourceValue;
    } else if (targetType === 'object' && sourceType === 'object') {
      if (sourceValue.constructor === Object) {
        // source object is generic object (simple patch).
        // deep update props of target nested object
        deepUpdate(targetValue, sourceValue);
      } else {
        // source object is class instance.
        // replace nested object
        target[prop] = sourceValue;
      }
    } else {
      target[prop] = sourceValue;
    }
  }

  return target;
}
