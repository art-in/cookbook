import {Component, Input, Output, EventEmitter} from 'angular2/core';
import RecipeService from '../recipe-service/recipe-service';
import {url, guid} from '../../helpers/helpers';
import AutofocusDirective from '../../directives/autofocus';
import SelectOnClickDirective from '../../directives/select-on-click';

@Component({
    selector: 'recipe-card-min',
    templateUrl: url.resolve('recipe-card-min.html'),
    styleUrls: [url.resolve('recipe-card-min.css')],
    providers: [RecipeService],
    directives: [AutofocusDirective, SelectOnClickDirective]
})
export default class RecipeCardMin {
    @Input()
    recipe;

    @Input()
    editable;

    @Input()
    deletable;

    @Input()
    focusName;

    @Output()
    recipeDeleted = new EventEmitter();

    service;

    constructor(service: RecipeService) {
        this.service = service;
    }

    get photoPath() {
        return `api/recipes/photo/${this.recipe.PhotoId}`;
    }

    async onDelete(e) {
        e.stopPropagation();
        await this.service.deleteRecipe(this.recipe.Id);
        this.recipeDeleted.emit();
    }

    async onPhotoChange(e) {
        if (!this.editable || !e.target.files.length) {
            return;
        }

        let photo = e.target.files[0];
        let photoId = guid();
        await this.service.uploadRecipePhoto(photoId, photo);
        this.recipe.PhotoId = photoId;
    }

    onPhotoAdd(e, photoInput) {
        if (!this.editable) {
            return;
        }

        e.stopPropagation();
        photoInput.click();
    }

    onPhotoDelete(e) {
        e.stopPropagation();
        this.recipe.PhotoId = null;
    }
}