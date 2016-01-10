import {Directive, ElementRef} from 'angular2/core';

@Directive({
    selector: '[select-on-click]'
})
export default class SelectOnClickDirective {
    constructor(el: ElementRef) {
        let element = el.nativeElement;
        element.addEventListener('click', () => {
            element.select();
        });
    }
}