import { Component } from '@angular/core';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';

@Component({
  selector: 'app-load-spinner',
  templateUrl: '../../templates/shared/components/load-spinner/load-spinner.component.html'
})
export class LoadSpinnerComponent {
  constructor(private spinner: SwitchSpinnerService) {}

  get switch() {
    return this.spinner.state;
  }
}
