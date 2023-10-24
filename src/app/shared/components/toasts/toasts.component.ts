import { Component, TemplateRef } from '@angular/core';
import { ToastService, Toast } from '@core/services/toast/toast.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-toasts',
  templateUrl: '../../../../templates/shared/components/toasts/toasts.component.html',
  styleUrls: ['../../../../templates/shared/components/toasts/toasts.component.scss'],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({
          visibility: 'visible',
          transform: 'translate3d(0, 100%, 0)'
        }),
        animate('100ms', style({
          transform: 'translate3d(0, 0, 0)'
        })),
      ]),
      transition(':leave', [
        animate('100ms', style({
          visibility: 'hidden',
          transform: 'translate3d(0, 100%, 0)'
        }))
      ])
    ])
  ]
})
export class ToastsComponent {
  constructor(public toastService: ToastService) {}

  isTemplate = (toast: Toast): boolean => (toast.textOrTemplate instanceof TemplateRef);

  get toast() {
    return this.toastService.mainToast.value;
  }

  doneLeaveAnimation(event: any) {
    if (event.toState === 'void') {
      this.toastService.setMainToastWithQueuedToast();
    }
  }

  dismiss() {
    this.toastService.dismiss();
  }
}
