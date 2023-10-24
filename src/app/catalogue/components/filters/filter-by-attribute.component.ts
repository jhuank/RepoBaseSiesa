import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-filter-by-attribute',
    templateUrl: '../../../../templates/catalogue/components/filters/filter-by-attribute.component.html'
})
export class FiltersByAttributesComponent {
    @Input() attributes: any[] = [];
    @Input() markedAttributes: any = {};
    @Output() filterChange = new EventEmitter();

    constructor() { }

    handleChange(attribute: any) {
        this.filterChange.emit(attribute);
    }

    isChecked(attribute: any): boolean {
        if (!this.markedAttributes[attribute.attributeId]) {
            return false;
        }

        return this.markedAttributes[attribute.attributeId].includes(attribute.id);
    }
}