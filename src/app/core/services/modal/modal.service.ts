import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public show = false;
  public showActions = false;
  public template: string | TemplateRef<any> = '';
  public context: any;
  private acceptEventSubject: Subject<boolean> = new Subject<boolean>();

  open(
    template: string | TemplateRef<any>,
    context?: any,
    callback?: (accept: boolean) => void
  ): void  {
    this.show = true;
    this.context = context;
    this.showActions = !!callback;
    this.template = template;

    if (callback) {
      this.acceptEventSubject.pipe(take(1)).subscribe((status) => {
        callback(status);
        this.dismiss();
      });
    }
  }

  dismiss(): void {
    this.show = false;
  }

  onAccept(response: boolean): void {
    this.acceptEventSubject.next(response);
  }
}
