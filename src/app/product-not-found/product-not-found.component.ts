import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@core/services/common/common.service';
import { AdvertisementsService, Advertisement } from '@shared/services/advertisements/advertisements.service';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services/auth/auth.service';
import { EnvService } from '@core/services/env/env.service';
import { titles } from '@config/titles.constants';
import { ToastService } from '@core/services/toast/toast.service';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  templateUrl: '../../templates/product-not-found/product-not-found.component.html',
  styleUrls: ['../../templates/product-not-found/product-not-found.component.scss']
})
export class ProductNotFoundComponent implements OnInit {
  public loading = false;
  public feedback = false;
  public productFormNotFound = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^([a-zA-Z0-9_.+-])+\\@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$')
    ]),
    phone: new FormControl('', [
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(7),
      Validators.minLength(7),
      Validators.min(1000000)
    ]),
    indicative: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(3),
      Validators.min(1)
    ]),
    movil: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.min(1000000000)
    ]), // TODO: es Mobile, requiere ajuste desde la API
    city: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    replyOption: new FormControl('', Validators.required),
    productSearchText: new FormControl(''),
    captcha: new FormControl('', Validators.required),
  });
  public cms$: Observable<Advertisement>;

  constructor(
    public envService: EnvService,
    private commonService: CommonService,
    public authService: AuthService,
    private advertisementService: AdvertisementsService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
    const params = this.route.snapshot.params;

    this.productFormNotFound.get('productSearchText').setValue(params.word);
    this.advertisementService.setTitle(titles.productNotFound);

    if (this.authService.isAuthenticated) {
      const user = this.authService.currentUserValue;
      this.productFormNotFound.setValue({
        ...this.productFormNotFound.value,
        name: user.contactFirstName,
        lastName: user.contactLastName,
        email: user.contactEmail,
        indicative: user.phoneCode,
        movil: user.mobile,
        phone: user.phone,
        city: user.city
      });
    }

    this.cms$ = this.advertisementService.getAdvertisements('PAG-27');
  }

  send() {

    const context = {
      title: 'Faltan algunos datos por diligenciar...'
    };
    let message = '';

    if (this.productFormNotFound.invalid) {

      message = message + 'Para continuar con este proceso debes diligenciar los siguientes datos:<br>';

      if (this.productFormNotFound.controls.name.errors) {
        if (this.productFormNotFound.controls.name.errors.required) {
          message = message + '<br>- Nombre';
        }
      }
      if (this.productFormNotFound.controls.lastName.errors) {
        if (this.productFormNotFound.controls.lastName.errors.required) {
          message = message + '<br>- Apellido';
        }
      }
      if (this.productFormNotFound.controls.gender.errors) {
        if (this.productFormNotFound.controls.gender.errors.required) {
          message = message + '<br>- Género';
        }
      }
      if (this.productFormNotFound.controls.city.errors) {
        if (this.productFormNotFound.controls.city.errors.required) {
          message = message + '<br>- Ciudad';
        }
      }
      if (this.productFormNotFound.controls.email.errors) {
        if (this.productFormNotFound.controls.email.errors.required) {
          message = message + '<br>- Correo Electrónico';
        }
      }
      if (this.productFormNotFound.controls.indicative.errors) {
        if (this.productFormNotFound.controls.indicative.errors.required) {
          message = message + '<br>- Indicativo del país';
        }
      }
      if (this.productFormNotFound.controls.movil.errors) {
        if (this.productFormNotFound.controls.movil.errors.required) {
          message = message + '<br>- Celular';
        }
      }
      if (this.productFormNotFound.controls.phone.errors) {
        if (this.productFormNotFound.controls.phone.errors.required) {
          message = message + '<br>- Teléfono';
        }
        if ( this.productFormNotFound.controls.phone.errors.maxlength) {
          message = message + '<br>- Teléfono : máximo 7 dígitos';
        }
      }


      if (this.productFormNotFound.controls.replyOption.errors) {
        if (this.productFormNotFound.controls.replyOption.errors.required) {
          message = message + '<br>- Como desea ser contactado';
        }
      }
      if (this.productFormNotFound.controls.message.errors) {
        if (this.productFormNotFound.controls.message.errors.required) {
          message = message + '<br>- Mensaje';
        }
      }
      if (this.productFormNotFound.controls.captcha.errors) {
        if (this.productFormNotFound.controls.captcha.errors.required) {
          message = message + '<br>- Captcha';
        }
      }

      this.modalService.open(message, context);
      //return this.toastService.warning('Aun hacen falta campos por diligenciar');
    }else{
      this.loading = true;

      this.commonService.submitProductFormNotFound(this.productFormNotFound.value).subscribe((response: any) => {
        this.feedback = !response.error;
        this.loading = false;
      });

    }

  }
}
