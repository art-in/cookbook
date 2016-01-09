import {Component} from 'angular2/core';
import {Router, RouteConfig, RouterOutlet, Location} from 'angular2/router';
import RecipeList from './recipes/recipe-list/recipe-list';

@Component({
    selector: 'app',
    template: `
        <base href="/">
        <router-outlet></router-outlet>
    `,
    directives: [RouterOutlet]
})
@RouteConfig([
    {path: '/recipes/', name: 'RecipeList', component: RecipeList}
])
export default class {
    constructor(router: Router, location: Location) {
        this.router = router;
        this.location = location;
    }

    ngOnInit() {
        if (this.location.path() === '') {
            this.router.navigate(['RecipeList']);
        }
    }
}