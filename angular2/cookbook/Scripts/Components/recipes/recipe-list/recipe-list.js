import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import RecipeService from '../recipe-service/recipe-service';
import {url} from '../../helpers/helpers';
import RecipeCardMin from '../recipe-card-min/recipe-card-min';
import RecipeCard from '../recipe-card/recipe-card';

@Component({
    selector: 'recipe-list',
    templateUrl: url.resolve('recipe-list.html'),
    styleUrls: [url.resolve('recipe-list.css')],
    directives: [RecipeCardMin, RecipeCard]
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

        this.selectedRecipeId = this.routeParams.params.rid;
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

    selectedRecipeId;

    ngOnInit() {
        this.reload();
    }

    async reload() {
        let sortProp = this.routeParams.get('sprop') || 'Name';
        let sortDesc = this.routeParams.get('sdesc') !== null;
        let page = this.routeParams.get('p') || 1;

        let skip = (page - 1) * this.pageSize;
        let limit = this.pageSize;

        let data = await this.service.getRecipes(
            sortProp, sortDesc, skip, limit);

        this.recipes = data.recipes;
        this.recipesTotal = data.recipesTotal;

        // update pages
        let pageCount =
            Math.ceil(this.recipesTotal / this.pageSize);
        this.pages = [];
        for (let i = 1; i <= pageCount; i++) {
            this.pages.push(i);
        }

        this.currentPage = (Number(this.routeParams.params.p) || 1);

        // update sort
        this.currentSortProp = (this.routeParams.params.sprop || 'Name');
    }

    onSort(prop) {
        let routeName = 'RecipeList';
        let sortProp = this.routeParams.get('sprop') || 'Name';
        let sortDesc = this.routeParams.get('sdesc') !== null;
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

    onRecipeAdd() {
        this.selectedRecipeId = '_NEW_';
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
        let params = this.routeParams.params;
        params.rid = recipe.Id;
        this.router.navigate(['RecipeList', params]);
        this.selectedRecipeId = recipe.Id;
    }

    onRecipeCardClosing() {
        let params = this.routeParams.params;
        delete params.rid;
        this.router.navigate(['RecipeList', params]);
        this.selectedRecipeId = null;
    }

    onRecipeDeleted() {
        if (this.recipes.length === 1 && this.currentPage !== 1) {
            // move one page back if last item on the page
            this.onPage(this.currentPage - 1);
        } else {
            this.reload();
        }
    }

    onRecipeCardSaved() {
        this.reload();
    }

    onRecipeCardDeleted() {
        this.onRecipeCardClosing();
        this.onRecipeDeleted();
    }
}