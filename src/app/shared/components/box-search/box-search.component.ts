import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

interface Result {
  value: string | number;
  text: string;
}

@Component({
  selector: 'app-box-search',
  templateUrl: '../../../../templates/shared/components/box-search/box-search.component.html',
  styleUrls: ['../../../../templates/shared/components/box-search/box-search.component.scss'],
})
export class BoxSearchComponent {
  @Input() placeholder = 'Buscar...';
  @Input() className = 'form-control';
  @Input() minLength = 3;
  @Input() searching = false;
  @Input() results$: Observable<Result[]>;
  @Output() handleInput: EventEmitter<string> = new EventEmitter();
  @Output() handleSelect: EventEmitter<Result> = new EventEmitter();

  public showSearchResults: boolean;

  constructor() {
    this.showSearchResults = false;
  }

  search(text: string) {
    this.showSearchResults = true;
    this.handleInput.emit(text);
  }

  select(item: Result) {
    this.showSearchResults = false;
    this.placeholder = item.text;
    this.handleSelect.emit(item);
  }
}
