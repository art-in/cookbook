const recipesBase = 'Scripts/components/recipes';

export var url = {
    resolve(fileName) {
        let parts = fileName.split('.');
        parts.pop();
        let baseFileName = parts.join('.');

        return `${recipesBase}/${baseFileName}/${fileName}`;
    }
};

/**
 * Generates GUID string
 * @return {string} GUID string
 */
export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = crypto.getRandomValues(
            new Uint8Array(1))[0] % 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Dumb object clone
 * @param {object} obj - object to clone
 * @return {object} cloned object
 */
export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}