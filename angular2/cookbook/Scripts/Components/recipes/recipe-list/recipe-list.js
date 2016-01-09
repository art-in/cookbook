import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import RecipeService from '../recipe-service/recipe-service';
import url from '../../helpers/url';
import RecipeCardMin from '../recipe-card-min/recipe-card-min';

@Component({
    selector: 'recipe-list',
    templateUrl: url.resolve('recipe-list.html'),
    styleUrls: [url.resolve('recipe-list.css')],
    directives: [RecipeCardMin]
})
export default class RecipeList {
    constructor(
        service: RecipeService,
        router: Router,
        routeParams: RouteParams) {

        this.recipes = [];
        this.recipesTotal = 0;
        this.service = service;
        this.router = router;
        this.routeParams = routeParams;

        this.pageSize = 3;
    }

    service;

    get recipes() {
        return this._recipes;
    }
    set recipes(val) {
        this._recipes = val;
    }

    pageSize;
    recipesTotal;

    pages = [];
    currentPage;
    currentSortProp;

    ngOnInit() {
        this.reload();
    }

    reload() {
        let sortProp = this.routeParams.get('sprop') || 'Name';
        let sortDesc = this.routeParams.get('sdesc') !== null;
        let page = this.routeParams.get('p') || 1;

        let skip = (page - 1) * this.pageSize;
        let limit = this.pageSize;

        this.service
            .getRecipes(sortProp, sortDesc, skip, limit)
            .then(data => {
                this.recipes = data.recipes;
                this.recipesTotal = data.recipesTotal;

                // update pages
                let pageCount =
                    Math.floor(this.recipesTotal / this.pageSize) + 1;
                this.pages = [];
                for (let i = 1; i <= pageCount; i++) {
                    this.pages.push(i);
                }

                this.currentPage = (+this.routeParams.params.p || 1);

                // update sort
                this.currentSortProp = (this.routeParams.params.sprop || 'Name');
            });
    }

    onSort(prop) {
        let routeName = 'RecipeList';
        let sortProp = this.routeParams.get('sprop') || 'Name';
        let sortDesc = this.routeParams.get('sdesc') !== null;
        let page = this.routeParams.get('p') || 1;

        let routeParams = this.routeParams.params;

        if (prop === sortProp) {
            sortDesc = !sortDesc;
        } else {
            sortDesc = false;
            // start from 1st page when changing sort prop
            delete routeParams.p;
        }

        switch (prop) {
        case 'Name':
            // default prop
            delete routeParams.sprop;
            break;
        case 'Complexity':
            routeParams.sprop = 'Complexity';
            break;
        case 'Popularity':
            routeParams.sprop = 'Popularity';
            break;
        default:
            throw Error(`Unknown sort prop: ${prop}`);
        }

        if (sortDesc) {
            routeParams.sdesc = true;
        } else {
            delete routeParams.sdesc;
        }

        this.router.navigate([routeName, routeParams]);

        this.reload();
    }

    onNewRecipe() {
        let recipe = this.service.createRecipe();
        this.selectedRecipe = recipe;

        alert('creating new recipe');
    }

    onPage(pageNumber) {
        if (pageNumber > this.pages.length || pageNumber <= 0) {
            return;
        }

        this.currentPage = pageNumber;
        let params = this.routeParams.params;
        params.p = this.currentPage;
        if (params.p === 1) {
            delete params.p;
        }
        this.router.navigate(['RecipeList', params]);

        this.reload();
    }

    onPagePrev() {
        this.onPage(this.currentPage - 1);
    }

    onPageNext() {
        this.onPage(this.currentPage + 1);
    }

    onRecipeSelected(recipe) {
        alert(`Editing recipe '${recipe.Name}'`);
    }

}