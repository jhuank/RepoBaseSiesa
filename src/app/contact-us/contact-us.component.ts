import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import {AdvertisementsService} from '../shared/services/advertisements/advertisements.service';
import {ContactService} from '../services/contact.service';
import { ToastService } from '@core/services/toast/toast.service';
import {Meta, Title} from '@angular/platform-browser';
import { AuthService } from '@core/services/auth/auth.service';
import { titles } from '@config/titles.constants';
import { ModalService } from '@core/services/modal/modal.service';
import { ParametersService } from '@core/services/parameters/parameters.service';



@Component({
  selector: 'app-contact-us',
  templateUrl: '../../templates/contact-us/contact-us.component.html',
  styleUrls: ['../../templates/contact-us/contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  public affairs: any;
  public relatedto: any;
  public contactThroughs: any;
  public companieInfo: any;
  public contact: any;
  public page = 'PAG-7';
  public cmsData: any;
  public loading = false;
  public b2sContent: any;
  public registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^([a-zA-Z0-9_.+-])+\\@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$'),
      Validators.maxLength(50)
    ]),
    gender: new FormControl('', Validators.required),
    city: new FormControl(''),
    indicative: new FormControl('', [
      /*Validators.required,*/
      Validators.min(1),
      Validators.maxLength(4)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10)
    ]),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', [
      Validators.required,
      Validators.maxLength(500)
    ]),
    company: new FormControl(''),
    acceptPolicies: new FormControl(false, Validators.requiredTrue),
    captcha: new FormControl('', Validators.required)
  });
  public cities: any;
  public mailSent = false;
  public contactMatters: any;
  private sendingEmail: boolean;

  constructor(
    private adService: AdvertisementsService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private contactService: ContactService,
    private modalService: ModalService,
    public parametersService: ParametersService,
  ) {}
   indicativeRequired(formControl: AbstractControl) {
    if (!formControl.parent) {
      return null;
    }

    if (formControl.parent.get('myCheckbox').value) {
      return Validators.required(formControl);
    }
    return null;
  }
  ngOnInit() {


    this.adService.setTitle(titles.contact);

    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
      this.adService.setMetaTags({title: data?.seo?.title ,
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords});
    });

    this.useUserData();
    this.getContactLocations();

    this.getContactMatters();
  }

  useUserData() {
    const user = this.authService.currentUserValue;

    if (user) {
      this.registerForm.get('name').setValue(user.contactFirstName);
      this.registerForm.get('email').setValue(user.contactEmail);
      this.registerForm.get('city').setValue(user.city);
      this.registerForm.get('phone').setValue(user.mobile);
      this.registerForm.get('indicative').setValue(user.phoneCode);
    }
  }

  getContactLocations() {
    this.contactService.getContactLocations().subscribe((response: any) => {
      this.cities = response;
    });
  }

  onSubmit() {

    const context = {
      title: 'Faltan algunos datos por diligenciar...'
    };
    let message = '';

    if (this.registerForm.invalid) {

      message = message + 'Para continuar con este proceso debes diligenciar los siguientes datos:<br>';

      if (this.registerForm.controls.name.errors) {
        if (this.registerForm.controls.name.errors.required) {
          message = message + '<br>- Nombre';
        }
      }
        if (this.registerForm.controls.gender.errors) {
          if (this.registerForm.controls.gender.errors.required) {
            message = message + '<br>- Género';
          }
        }
        if (this.registerForm.controls.email.errors) {
          if (this.registerForm.controls.email.errors.required) {
            message = message + '<br>- Correo Electrónico';
          }
        }
        if (this.registerForm.controls.indicative.errors) {
          if (this.registerForm.controls.indicative.errors.required) {
            message = message + '<br>- Indicativo';
          }
        }
        if (this.registerForm.controls.phone.errors) {
          if (this.registerForm.controls.phone.errors.required) {
            message = message + '<br>- Teléfono Celular';
          }
        }
        if (this.registerForm.controls.subject.errors) {
          if (this.registerForm.controls.subject.errors.required) {
            message = message + '<br>- Asunto';
          }
        }
        if (this.registerForm.controls.message.errors) {
          if (this.registerForm.controls.message.errors.required) {
            message = message + '<br>- Mensaje';
          }
        }
      if (this.registerForm.controls.acceptPolicies.errors) {
        if (this.registerForm.controls.acceptPolicies.errors.required) {
          message = message + '<br>- Aceptar Terminos y condiciones';
        }
      }
      if (this.registerForm.controls.captcha.errors) {
          if (this.registerForm.controls.captcha.errors.required) {
            message = message + '<br>- Captcha';
          }
        }

        this.modalService.open(message, context);
       // return this.toastService.warning('Aun hacen falta campos por diligenciar');

    }else{
        this.loading = true;
        this.contactService.sendMailContact(this.registerForm).subscribe(
          (response: any) => {
            if (!response.error) {
              this.toastService.success('Mensaje enviado, pronto uno de nuestros agentes se pondrá en contacto.');
              this.registerForm.reset();
              this.useUserData();
            }
          },
          error => console.error(error),
          () => this.loading = false
        );

    }


  }

  /*
* Switch indicative field required validation
* */
  private switchIndicativeValidation() {
    this.parametersService.getCompanyParameters().subscribe((page) => {

      if(typeof page.info.company.validaIndicativoContacto !== 'undefined' || !this.parametersService?.page?.mostrar_indicativo_contacto) {
        if (page.info.company.validaIndicativoContacto) {
          this.registerForm.get('indicative').clearValidators();
          this.registerForm.get('indicative').setValidators([Validators.min(1),
            Validators.maxLength(4)]);
        } else {
          this.registerForm.get('indicative').setValidators([Validators.required, Validators.min(1), Validators.maxLength(4)]);
        }
        this.registerForm.get('indicative').updateValueAndValidity();
      }
    });


  }


  getContactMatters(){
    this.contactService.getContactMatters().subscribe((response: any) => {
      this.contactMatters = response;
    });
  }
}
