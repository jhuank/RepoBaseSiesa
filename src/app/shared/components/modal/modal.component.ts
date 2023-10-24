import { Component, TemplateRef } from '@angular/core';
import {ModalService} from '@core/services/modal/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: '../../../../templates/shared/components/modal/modal.component.html',
  styleUrls: ['../../../../templates/shared/components/modal/modal.component.scss']
})
export class ModalComponent {
  constructor(public modalService: ModalService) {}

  close() {
    this.modalService.dismiss();
  }

  accept(response: boolean) {
    this.modalService.onAccept(response);
  }

  isTemplate = (template: any) => (template instanceof TemplateRef);

  isString = (template: any) => (typeof template === 'string');
}
