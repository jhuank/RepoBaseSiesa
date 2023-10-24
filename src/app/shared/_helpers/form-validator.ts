import { Injectable } from '@angular/core';
import { ToastService } from '@core/services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})

export class FormValidator {

  constructor(private toastService: ToastService) { }

  validForm(form) {

    if (!form.valid) {

      for (const fields in form.controls) {
        if (form.controls.hasOwnProperty(fields)) {
          const element = form.controls[fields];
          if (element.errors !== null) {

            let errorName = Object.keys(element.errors)[0];
            let valueErrorMessage:any = Object.values(element.errors)[0];
            let fieldElement = document.getElementsByName(fields);
            let errorMessage: string;

            switch (errorName) {
              case 'required':
                errorMessage = "Es requerido";
                break;
              case 'email':
                errorMessage = "Es invalido";
                break;
              case 'minlength':
                errorMessage = `Los caracteres minimos son ${valueErrorMessage.requiredLength}`;
                break;
              case 'maxlength':
                errorMessage = `Los caracteres maximos son ${valueErrorMessage.requiredLength}`;
                break;
              case 'pattern':
                errorMessage = `El formato es invalido`;
                break;
              default:
                errorMessage = `Error desconocido contacte con el administrador`;
                break;
            }

            let nameElement = fieldElement[0].getAttribute('real-name')
            this.showError(nameElement, errorMessage);

          }
        }
      }
      return false;
    }
    return true;
  }

  showError(title: string, message: string) {
    if (message.length > 0) {
      this.toastService.error(message, title);
    }
  }
}
