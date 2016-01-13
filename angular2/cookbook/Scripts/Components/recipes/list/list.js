import {Component, Input} from 'angular2/core';
import {guid} from '../../helpers/helpers';
import SelectOnClickDirective from '../../directives/select-on-click';

@Component({
    selector: 'list',
    template: `
        <ul *ngIf="sortedItems.length > 0"
            [ngClass]="{ ordered: ordered }">
            <li *ngFor="#item of sortedItems">
                <input [(ngModel)]="item.Description"
                        [disabled]="!editable"
                        type="text"
                        select-on-click>

                <button *ngIf="deletable"
                        class="btn btn-default"
                        (click)="onDelete(item)">
                    <span class="glyphicon glyphicon-trash"></span>
                </button>
            </li>
        </ul>
        <button *ngIf="editable"
                class="btn btn-default"
                (click)="onAdd()">
            <span class="glyphicon glyphicon-plus"></span>
        </button>
        `,
    styles: [`
        :host {
            display: block;
        }

        :host input {
            background: transparent;
            color: black;
            cursor: inherit;
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

    @Input()
    editable;

    @Input()
    deletable;

    @Input()
    sortable;

    @Input()
    ordered;

    get sortedItems() {
        return this.items.sort((i1, i2) => i1.Order > i2.Order);
    }

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