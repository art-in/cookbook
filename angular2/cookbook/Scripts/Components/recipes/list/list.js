import {Component, Input} from 'angular2/core';
import {guid} from '../../helpers/helpers';
import SelectOnClickDirective from '../../directives/select-on-click';

@Component({
    selector: 'list',
    template: `
        <a class="add" (click)="onAdd()">
            добавить
        </a>
        <ul [ngClass]="{ ordered: ordered }">
            <li *ngFor="#item of sortedItems">
                <input [(ngModel)]="item.Description"
                       [disabled]="!editable"
                       select-on-click>
                <a *ngIf="deletable" (click)="onDelete(item)">удалить</a>
            </li>
        </ul>
        `,
    styles: [`
        :host {
            display: block;
            outline: 1px solid lightgray;
        }

        :host > a.add {
            cursor: pointer;
        }

        :host input {
            border: none;
            background: transparent;
            color: black;
            cursor: inherit;
        }

        :host input:not([disabled]) {
            outline: 2px solid brown;
        }

        :host ul.ordered {
            list-style-type: decimal;
        }
        `],
    directives: [SelectOnClickDirective]
})
export default class List {
    constructor() {
    }

    @Input()
    items;

    get sortedItems() {
        return this.items.sort((i1, i2) => i1.Order > i2.Order);
    }

    @Input()
    editable;

    @Input()
    deletable;

    @Input()
    sortable;

    @Input()
    ordered;

    onAdd() {
        if (!this.editable) {
            return;
        }

        this.items.push({
            Id: guid(),
            Description: '',
            Order: this.items.length
        });
    }

    onDelete(item) {
        let itemIdx = this.items.indexOf(item);
        this.items.splice(itemIdx, 1);
    }
}