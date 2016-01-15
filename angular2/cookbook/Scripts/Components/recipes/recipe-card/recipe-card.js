import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {url, clone} from '../../helpers/helpers';
import RecipeCardMin from '../recipe-card-min/recipe-card-min';
import RecipeService from '../recipe-service/recipe-service';
import List from '../list/list';
import $ from 'jquery';

@Component({
    selector: 'recipe-card',
    templateUrl: url.resolve('recipe-card.html'),
    styleUrls: [url.resolve('recipe-card.css')],
    directives: [RecipeCardMin, List]
})
export default class RecipeCard {
    constructor(service: RecipeService) {
        this.service = service;
    }

    @Input()
    recipeId;

    @Output()
    closing = new EventEmitter();

    @Output()
    saved = new EventEmitter();

    @Output()
    deleted = new EventEmitter();

    service;

    recipe;
    prevRecipe;

    inEditMode;

    $modalElement = $(`#modal-element-id`);

    ngOnInit() {
        // show modal
        // bootstrap-jquery api - is only reason for direct DOM access.
        // bootstrap-attribute api will not work for starup popup from route
        this.$modalElement.modal('show');

        // on background click
        this.$modalElement.on('hide.bs.modal', () => {
            this.onClose();
        });

        window.addEventListener('beforeunload', this.onWindowBeforeUnloadBound);
    }

    ngOnDestroy() {
        this.$modalElement.modal('hide');
        window.removeEventListener('beforeunload',
            this.onWindowBeforeUnloadBound);
    }

    onWindowBeforeUnload(e) {
        if (this.inEditMode) {
            e.returnValue = `Некоторые данные могли быть не сохранены!`;
        }
    }

    onWindowBeforeUnloadBound = this.onWindowBeforeUnload.bind(this);

    async ngOnChanges() {
        if (this.recipeId) {
            let recipe = this.recipeId === '_NEW_' ?
                this.service.createRecipe() :
                await this.service.getRecipe(this.recipeId);

            this.recipe = recipe;

            this.inEditMode = this.recipeId === '_NEW_';
        }
    }

    onClose() {
        this.closing.emit();
    }

    async onSave() {
        await this.service.upsertRecipe(this.recipe);
        this.saved.emit();

        if (this.recipeId === '_NEW_') {
            this.closing.emit();
        } else {
            this.inEditMode = false;
        }
    }

    onEdit() {
        this.prevRecipe = this.recipe;
        this.recipe = clone(this.recipe);
        this.inEditMode = true;
    }

    onCancel() {
        this.recipe = this.prevRecipe;
        this.inEditMode = false;
    }

    async onDelete() {
        await this.service.deleteRecipe(this.recipe.Id);
        this.deleted.emit();
        this.closing.emit();
    }
}