import { Injectable, TemplateRef } from '@angular/core';
import { AppResponse } from '@core/models/common.model';
import { BehaviorSubject } from 'rxjs';
import { EnvService } from '../env/env.service';
import { ParametersService } from '../parameters/parameters.service';

export interface Toast {
  title?: string;
  className?: string;
  textOrTemplate?: string | TemplateRef<any>;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public mainToast = new BehaviorSubject<Toast>(null);
  private autoHiddenId: any;
  public queueToasts: Toast[] = [];
  public delay: 3000;

  constructor(
    private envService: EnvService
  ) {
    this.mainToast.subscribe((toast) => {
      if (toast) {
        this.autoHiddenId = setTimeout(
          () => this.dismiss(), toast.delay || this.envService.environment.toastDelay || this.delay
        );
      }
    });
  }

  setMainToastWithQueuedToast() {
    if (this.queueToasts.length) {
      return this.mainToast.next(this.queueToasts.shift());
    }
  }

  dismiss() {
    this.mainToast.next(null);
    clearInterval(this.autoHiddenId);
  }

  show(textOrTemplate: string | TemplateRef<any>, options?: Toast) {
    if (!this.mainToast.value) {
      return this.mainToast.next({ textOrTemplate, ...options });
    }

    return this.queueToasts.push({ textOrTemplate, ...options });
  }

  error(textOrTemplate: string | TemplateRef<any>, options?: Toast) {
    this.show(textOrTemplate, {
      className: 'bg-danger text-white',
      ...options
    });
  }

  warning(textOrTemplate: string | TemplateRef<any>, options?: Toast) {
    this.show(textOrTemplate, {
      className: 'bg-warning',
      ...options
    });
  }

  success(textOrTemplate: string | TemplateRef<any>, options?: Toast) {
    this.show(textOrTemplate, {
      className: 'bg-success text-white',
      ...options
    });
  }

  info(textOrTemplate: string | TemplateRef<any>, options?: Toast) {
    this.show(textOrTemplate, {
      className: 'bg-info text-white',
      ...options
    });
  }

  /**
   * Muestra el mensaje de la respuesta en un Toast
   */
  public showFeedback(response: AppResponse, title?: string, delay?: number) {
    if (response.error) {
      return this.error(response.message, { title ,delay});
    }

    return this.success(response.message, { title, delay});
  }
}
