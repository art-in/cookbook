import {Component, Input, EventEmitter} from 'angular2/core';
import RecipeService from '../recipe-service/recipe-service';
import url from '../../helpers/url';

@Component({
    selector: 'recipe-card-min',
    templateUrl: url.resolve('recipe-card-min.html'),
    styleUrls: [url.resolve('recipe-card-min.css')],
    providers: [RecipeService]
})
export default class {
    @Input()
    recipe;

    service;

    constructor(service: RecipeService) {
        this.service = service;
    }

    onDelete(e) {
        alert(`Deleting recipe: '${this.recipe.Name}'`);
        e.stopPropagation();
    }
}