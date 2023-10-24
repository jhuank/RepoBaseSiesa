import { Component, OnInit } from '@angular/core';
import {AdvertisementsService} from '../shared/services/advertisements/advertisements.service';
import {RegisterService} from '../services/register.service';
import { CartService } from '@core/services/cart/cart.service';
import {FormBuilder, FormGroup, NgForm, Validators, FormControl, AbstractControl, ValidationErrors} from '@angular/forms';
import { ToastService } from '@core/services/toast/toast.service';
import { AuthService } from '@core/services/auth/auth.service';
import { tap } from 'rxjs/operators';
import { ParametersService } from '@core/services/parameters/parameters.service';

@Component({
  selector: 'app-account',
  templateUrl: '../../templates/account/account.component.html',
  styleUrls: ['../../templates/account/account.component.scss']
})
export class AccountComponent implements OnInit {
  public accountForm: FormGroup;
  public changePasswordFormLoading = false;
  public changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(7)
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
      this.comparePasswordValidator.bind(this)
    ])
  });
  public flagPanelDatos = true;
  public compareToPass = true;
  public flagPanelPassword = false;
  public cmsData: any;
  public page = 'PAG-33';
  public compareToEmail = true;
  public accountDataForm = {
    firstName: '',
    middleName: '',
    lastName: '',
    surName: '',
    typeId: '',
    numberId: '',
    gender: '',
    locationSelected : false,
    locationsByFastSearch : [],
    country : '',
    state : '',
    city : '',
    email: '',
    emailConfirmation: '',
    IndicativeCountry: '57',
    IndicativeCity: '1',
    phone: '',
    indicative: '57',
    movil: '',
    receiveInformation: '',
    searchLocationtext: '',
    loadingLocationsByFastSearh: false,
    loadedLocationsByFastSearch: false,
    errorLoadingLocationsByFastSearch: false,
    movilAlterno: '',
    indicativoMovilDos: 57
  };
  public loadingUserInfo: boolean;
  public loadedUserInfo: boolean;
  public errorloadingUserInfo: boolean;
  public identificationsTypes = [];
  constructor(
    public authService: AuthService,
    private adService: AdvertisementsService,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private cartService: CartService,
    public parametersService: ParametersService
  ) { }

  ngOnInit(): void {
    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
      this.adService.setMetaTags({title: data?.seo?.title ,
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords});
    });
    this.initFieldsForm();
    this.getUserInfo();
  }
  getUserInfo() {
    this.loadingUserInfo = true;
    this.loadedUserInfo = false;
    this.errorloadingUserInfo = false;
    this.registerService.getUserInfo(this.authService.getUserId()).subscribe((response: any) => {
      
      this.loadingUserInfo = false;
      this.loadedUserInfo = true;
      this.errorloadingUserInfo = false;
      // Elementary info
      this.accountDataForm.firstName = response.userInfo.firstName;
      this.accountDataForm.middleName = response.userInfo.middleName;
      this.accountDataForm.lastName = response.userInfo.lastName;
      this.accountDataForm.surName = response.userInfo.surName;
      this.accountDataForm.email = response.userInfo.email;
      this.accountDataForm.IndicativeCity = response.userInfo.phoneIndicativeCity || 1;
      this.accountDataForm.IndicativeCountry = response.userInfo.phoneIndicativeCountry || response.userInfo.movilIndicative;
      this.accountDataForm.typeId = response.userInfo.typeId;
      this.accountDataForm.numberId = response.userInfo.numberId;

      this.accountDataForm.emailConfirmation = response.userInfo.emailConfirmation;
      this.accountDataForm.phone = response.userInfo.phone;
      this.accountDataForm.movil = response.userInfo.movil;
      this.accountDataForm.indicative = response.userInfo.movilIndicative;
      this.accountDataForm.receiveInformation = response.userInfo.receiveInformation;
      this.accountDataForm.gender = response.userInfo.sex;
      this.accountDataForm.city = response.userInfo.cityId;
      this.accountDataForm.searchLocationtext = response.userInfo.cityName;

      this.accountDataForm.movilAlterno = response.userInfo.movilAlterno;
      if(response.userInfo.indicativoMovilDos > 0) {
        this.accountDataForm.indicativoMovilDos = response.userInfo.indicativoMovilDos;
      }

    });
  }
  setPanel(type) {
    if (type === 'datos') {
      this.flagPanelDatos = true;
      this.flagPanelPassword = false;
    } else if (type === 'password') {
      this.flagPanelPassword = true;
      this.flagPanelDatos = false;
    }
  }
  getLocationsByFastSearch(searchLocationText) {

    this.accountDataForm.locationSelected = false;
    this.accountDataForm.locationsByFastSearch = [];
    this.accountDataForm.locationSelected = false;

    this.accountDataForm.country = '';
    this.accountDataForm.state = '';
    this.accountDataForm.city = '';

    this.accountDataForm.loadingLocationsByFastSearh = false;
    this.accountDataForm.loadedLocationsByFastSearch = false;
    this.accountDataForm.errorLoadingLocationsByFastSearch = false;

    try {
      if (searchLocationText.length > 3) {
        this.accountDataForm.loadingLocationsByFastSearh = true;
        this.cartService.searchLocationByText({
          searchText: searchLocationText,
          citiesERP: true
        }).subscribe((response: any) => {
          this.accountDataForm.loadingLocationsByFastSearh = false;
          this.accountDataForm.loadedLocationsByFastSearch = true;
          this.accountDataForm.locationsByFastSearch = response;
        });
      }
    } catch (e) {
    }
  }
  setLocationCity(location) {
    this.accountDataForm.country = location.countryId;
    this.accountDataForm.state = location.stateId;
    this.accountDataForm.city = location.cityId;
    this.accountDataForm.locationSelected = true;
    this.accountDataForm.searchLocationtext = location.cityName + ', ' + location.stateName + ' - ' + location.countryName;
  }
  compareEmail() {
    if (this.accountDataForm.email === this.accountDataForm.emailConfirmation) {
      this.compareToEmail = true;
    } else {
      this.compareToEmail = false;
    }

  }
  updateAccountData(form: NgForm) {
    const message = '';
    this.accountForm = this.formBuilder.group({
      userId: [this.authService.getUserId(), [Validators.required]],
      numberId: [this.accountDataForm.numberId, [Validators.required]],
      typeId: [this.accountDataForm.typeId, [Validators.required]],
      firstName: [form.value.firstName, [Validators.required]],
      middleName: [form.value.middleName],
      lastName: [form.value.lastName, [Validators.required]],
      surName: [form.value.surName],
      // tslint:disable-next-line:max-line-length
      email: [form.value.email, [Validators.required, Validators.pattern('^([a-zA-Z0-9_.+-])+\\@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$')]],
      IndicativeCountry: [form.value.IndicativeCountry],
      IndicativeCity: [form.value.IndicativeCity],
      phone: [form.value.phone],
      movil: [form.value.movil, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      indicative: [form.value.indicative, [Validators.required]],
      gender: [form.value.gender, [Validators.required]],
      city: [form.value.city, [Validators.required]],
      address: [form.value.address],
      receiveInformation: [form.value.receiveInformation],
      indicativeTwo: [form.value.indicativoMovilDos, [Validators.minLength(2), Validators.maxLength(4)]],
      movilAlterno: [form.value.movilAlterno, [Validators.minLength(10), Validators.maxLength(10)]],
    });
    

    if (this.accountForm.invalid) {
      this.toastService.error('Aun hacen falta campos por diligenciar');
      return;
    }
    this.registerService.userUpdate(this.accountForm).subscribe((data: any) => {
      if (data) {
        this.toastService.success(`<h5>Actualización exitosa</h5>${data.message}`);
      }
    }, error => {
      console.error('Error');
    });
  }

  updatePasswordData() {
    if (this.changePasswordForm.invalid) {
      return this.toastService.error('Aun hacen falta campos por diligenciar');
    }

    this.changePasswordFormLoading = true;
    this.registerService.passwordUpdate(this.changePasswordForm.value)
      .pipe(tap(() => this.changePasswordFormLoading = false))
      .subscribe((passResponse: any) => {
        this.toastService.success(passResponse.message);

        if (!passResponse.error) {
          this.changePasswordForm.reset();
        }
      });
  }

  comparePasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value !== control?.parent?.get('password')?.value) {
      return { compare: true };
    }

    return null;
  }

  initFieldsForm() {
    // Tipos de identificación
    this.registerService.getIdentificationsTypes().subscribe((data: any) => {
      this.identificationsTypes = (data);
    });
  }

}
