import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {CartService} from '@core/services/cart/cart.service';

@Component({
  selector: 'app-quantity',
  templateUrl: '../../../../templates/shared/components/quantity/quantity.component.html',
  styleUrls: ['../../../../templates/shared/components/quantity/quantity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuantityComponent implements OnInit, OnChanges {
  @Input() quantity ;
  @Input() factor = 1;
  @Input() min = 1;
  @Output() changeQuantity = new EventEmitter<number>(true);
  @Input() updatingQuantity = false;
  @Input() updatingQuantityIdItem = '';
  @Input() idItem = '';
  @Input() updatingQuantityPd = false;
  public inputQuantityControl = new FormControl(1);

  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    let delayTime = (this.updatingQuantityPd ) ? 0: 1000;
    this.inputQuantityControl.valueChanges.pipe(
      debounceTime(delayTime),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.changeQuantity.emit(value);
    });
    this.startQuantity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.min && (changes.min.currentValue !== changes.min.previousValue)) {
      this.inputQuantityControl.setValue(this.min);
    }
  }

  get currentQuantity(): number {
    return +this.inputQuantityControl.value;
  }

  minimumAvailable() {
    return (this.currentQuantity <= this.min);
  }

  startQuantity() {
    this.min = +this.min || 1;
    this.quantity = +this.quantity;
    this.factor = +this.factor || 1;

    if (this.min > this.quantity) {
      this.quantity = (this.min > 1) ? this.min : this.quantity;
    }

    this.inputQuantityControl.setValue(this.quantity);
  }

  minusQuantity() {
    const quantity = this.currentQuantity;
    const calc = quantity - this.factor;

    if (calc < 1) {
      return;
    }

    this.inputQuantityControl.setValue(quantity - this.factor);
  }

  plusQuantity() {
    const quantity = this.currentQuantity;

    this.inputQuantityControl.setValue(quantity + this.factor);
  }
}
