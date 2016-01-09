const recipesBase = 'Scripts/components/recipes';

export default {
    resolve(fileName) {
        let parts = fileName.split('.');
        parts.pop();
        let baseFileName = parts.join('.');

        return `${recipesBase}/${baseFileName}/${fileName}`;
    }
};