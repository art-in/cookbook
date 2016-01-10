import {Directive, ElementRef, Input} from 'angular2/core';

@Directive({
    selector: '[autofocus]'
})
export default class AutofocusDirective {
    constructor(el: ElementRef) {
        this.element = el.nativeElement;
    }

    element;

    @Input()
    set autofocus(focus) {
        if (focus) {
            this.element.select();
        }
    }
}