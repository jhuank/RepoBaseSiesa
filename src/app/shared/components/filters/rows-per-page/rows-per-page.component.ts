import { 
    Component, 
    ChangeDetectionStrategy, 
    OnInit, 
    Input, 
    Output, 
    EventEmitter 
} from '@angular/core';

@Component({
    selector: 'app-filter-rows-per-page',
    templateUrl: '../../../../../templates/shared/components/filters/rows-per-page/rows-per-page.component.html',
    styleUrls: ['../../../../../templates/shared/components/filters/rows-per-page/rows-per-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RowsPerPageComponent implements OnInit {
    @Input() public options: number[] = [12, 24, 48];
    @Input() private default?: number;
    @Output() private changeEvent: EventEmitter<number> = new EventEmitter<number>();
    public active: number;

    constructor() {}

    ngOnInit(): void {
        this.active = this.options.indexOf(this.default) || 0;
    }

    isActive(index: number): boolean {
        return this.active === index;
    }

    setActiveOption(index: number): void {
        this.active = index;
        this.changeEvent.emit(this.options[index]);
    }
}