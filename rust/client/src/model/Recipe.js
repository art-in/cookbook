import update from '../utils/deep-update';

export default class Recipe {
  id = null;
  name = '';
  description = '';
  complexity = 1; // [1; 10]
  popularity = 1; // [1; 10]
  ingredients = [];
  steps = [];
  hasImage = false;

  imageSrc = null;
  imageFile = null;

  constructor(data) {
    update(this, data);
  }
}
