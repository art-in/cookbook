import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import App from './components/app';
import RecipeService from
    './components/recipes/recipe-service/recipe-service';

document.addEventListener('DOMContentLoaded', () => {
    bootstrap(App, [
        ROUTER_PROVIDERS,
        RecipeService
    ]);
});
