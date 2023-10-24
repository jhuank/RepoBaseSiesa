import { Component, Input, ChangeDetectionStrategy, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: '../../../../templates/shared/components/input/input.component.html',
  styleUrls: ['../../../../templates/shared/components/input/input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  @Input() public inputControl: FormControl;
  @Input() public feedback: ValidationErrors;

  @Input() public type: 'text' | 'select' | 'password' | 'number' | 'letter' = 'text';
  @Input() public placeholder = '';
  @Input() public autocomplete: 'off' | 'on' = 'off';
  @Input() public maxLength = 50;

  @Input() public icon?: string | TemplateRef<any>;
  @Input() public iconPosition: 'start' | 'end' = 'start';

  @Output() public changeEvent = new EventEmitter();

  constructor() { }

  get isInvalid(): boolean {
    return (
      this.inputControl.invalid && (this.inputControl.dirty || this.inputControl.touched)
    );
  }

  getFeedbackMessage(): string {
    const errors = this.inputControl?.errors;

    if (errors) {
      const error = Object.keys(errors);

      if (error) {
        return this.feedback[error[0]];
      }
    }

    return '';
  }

  onChange(event: any) {
    this.changeEvent.emit(event.target.value);
  }
}
