import {Component} from 'angular2/core';

@Component({
    selector: 'app',
    template: '<h1>{{boom()}}</h1>'
})
export default class {
    constructor() {
    }
    boom() {
        return 'setup';
    }
}