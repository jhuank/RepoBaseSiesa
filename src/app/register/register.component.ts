import {Component, OnInit} from '@angular/core';
import {AdvertisementsService} from '../shared/services/advertisements/advertisements.service';
import {AuthService} from '@core/services/auth/auth.service';
import {Router} from '@angular/router';
import {FormGroup, Validators, FormControl, ValidationErrors, AbstractControl} from '@angular/forms';
import {RegisterService} from '../services/register.service';
import * as moment from 'moment';
import {CartService} from '@core/services/cart/cart.service';
import {FavoritesService} from '../services/favorites.service';
import {ToastService} from '@core/services/toast/toast.service';
import {Observable, of, Subject} from 'rxjs';
import {map, catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {titles} from '@config/titles.constants';
import {LocationService} from '@core/services/location/location.service';
import {ParametersService} from '@core/services/parameters/parameters.service';
import {type} from "os";


@Component({
  selector: 'app-register',
  templateUrl: '../../templates/register/register.component.html',
  styleUrls: ['../../templates/register/register.component.scss']
})
export class RegisterComponent implements OnInit {
  public loading = false;
  public paramestroRegistro: any;
  public mostrarAsteriscoIndicativo : boolean;
  public registerForm = new FormGroup({
    type: new FormControl('personas'),

    // Persona
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    typeId: new FormControl(''),
    numberId: new FormControl('',{
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.minLength(8),
      ]
   }),
    gender: new FormControl(''),
    birthdate: new FormControl(''),

    // Compañía
    businessName: new FormControl(''),
    activity: new FormControl(''),
    nit: new FormControl('', {updateOn: 'blur'}),
    dv: new FormControl(''),
    numberEmployees: new FormControl(''),
    firstNameContactPerson: new FormControl(''),
    lastNameContactPerson: new FormControl(''),

    // Datos
    indicative: new FormControl('', [
      Validators.required,
      Validators.maxLength(4)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(50)
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50)
    ]),
    country: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl('', Validators.required),
    neighborhood: new FormControl('', Validators.required),

    // Cuenta
    email: new FormControl('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9_.+-])+\\@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$'),
        Validators.maxLength(50)
      ],
      asyncValidators: [
        this.emailAsyncValidator.bind(this)
      ]
    }),
    emailConfirmation: new FormControl('', [
      Validators.required,
      this.compareEmailsValidator.bind(this)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(50)
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
      this.comparePasswordValidator.bind(this)
    ]),
    receiveInformation: new FormControl(false),
    acceptPolicies: new FormControl(false, Validators.requiredTrue),

    // Verificación
    captcha: new FormControl('', Validators.required)
  });
  public registerFormFeedback = {

    // Persona
    firstName: {
      required: 'Ingrese su(s) nombre(s)',
      minlength: 'Ingrese al menos 3 caracteres',
      maxlength: 'Ha superado el máximo de caracteres permitido'
    },
    lastName: {
      required: 'Ingrese su(s) apellido(s)',
      minlength: 'Ingrese al menos 3 caracteres',
      maxlength: 'Ha superado el máximo de caracteres permitido'
    },
    typeId: {
      required: 'Selecciona el tipo de identificación'
    },
    numberId: {
      required: 'Ingrese su número de identificación',
      document: 'Este numero de identificación, ya se encuentra asociado a una cuenta',
      minlength: 'Ingrese al menos 7 digitos',
      maxlength: 'Ha superado el máximo de caracteres permitido'
    },
    gender: {
      required: 'Ingrese su genero'
    },
    birthdate: {
      required: 'Ingrese su fecha de nacimiento',
      minor: 'No se permite el registro de menores de edad'
    },

    // Compañía
    businessName: {
      required: 'Ingrese la razón social'
    },
    nit: {
      required: 'Ingrese el NIT',
      document: 'El Nit ya tiene una cuenta asociada. Ingrese con el email asociado a este NIT'
    },
    dv: {
      required: 'Ingrese el DV'
    },
    activity: {
      required: 'Seleccione una actividad económica'
    },
    firstNameContactPerson: {
      required: 'Ingrese el nombre de la persona de contacto'
    },
    lastNameContactPerson: {
      required: 'Ingrese los apellidos de la persona de contacto'
    },

    // Datos
    indicative: {
      required: 'Ingrese el indicativo del país',
      maxlength: 'El numero de indicativo debe contener máximo 4 dígitos'
    },
    phone: {
      required: 'Ingrese su numero de celular',
      minlength: 'El numero de celular debe contener mínimo 10 dígitos',
      maxlength: 'El numero de celular debe contener máximo 10 dígitos'
    },
    address: {
      required: 'Ingrese su dirección',
      maxlength: 'La dirección de residencia debe contener máximo 50 caracteres',
      minlength: 'La dirección de residencia debe contener mínimo 6 caracteres',
    },
    city: {
      required: 'Selecciona la ciudad de residencia'
    },
    neighborhood: {
      required: 'Seleccione el barrio'
    },

    // Cuenta
    email: {
      required: 'El correo electrónico es requerido',
      pattern: 'Ingrese un correo electrónico válido',
      used: 'El correo electrónico ya se encuentra registrado'
    },
    emailConfirmation: {
      required: 'El correo de verificación es requerido',
      compare: 'El correo de verificación debe ser igual al correo electrónico'
    },
    password: {
      required: 'La contraseña es requerida',
      minlength: 'El campo contraseña debe contener mínimo 7 caracteres entre números y letras'
    },
    passwordConfirmation: {
      required: 'La contraseña de verificación es requerida',
      compare: 'La contraseña de verificación debe ser igual a la contraseña'
    },
    acceptPolicies: {
      required: 'Debes aceptar los términos y condiciones'
    },
  };
  public searchLocationSubject = new Subject<string>();
  public searchNeighborhoodSubject = new Subject<string>();
  public compareToEmail = true;
  public compareToPass = true;
  public flagPanelPersonal = true;
  public flagPanelEmpresarial = false;
  public identificationsTypes = [];
  public password = '';
  public AgeMessageError: any;
  public cmsData: any;
  public page = 'PAG-4';
  public sendingMail = false;
  public mailSent = false;
  public companyValidatingNumberId = false;
  public validatedNumberId = false;
  public companyValidatedNumberId = false;
  public companyNumberIdIsValid = false;
  public dateBorn: any;
  public validatingEmail = false;
  public validatedEmail = false;
  public emailIsValid = false;
  public dateIsValid = false;
  public validatedDate = false;
  public gender = [];
  public activity = [];
  public economicActivities: any;
  public neighborhoods: [];
  public dataForm = {
    locationSelected: false,
    NeighborhoodSelected: false,
    locationsByFastSearch: [],
    loadingLocationsByFastSearch: false,
    loadedLocationsByFastSearch: false,
    errorLoadingLocationsByFastSearch: false,
    NeighborhoodsByFastSearch: [],
    loadingNeighborhoodsByFastSearch: false,
    loadedNeighborhoodsByFastSearch: false,
    errorLoadingNeighborhoodsByFastSearch: false,
    searchLocationText: '',
    searchNeighborhoodText: '',
    SolicitarBarrioRegistro: undefined,
    Neighborhood: undefined
  };
  private cityId: string;

  constructor(
    private adService: AdvertisementsService,
    private authService: AuthService,
    private cartService: CartService,
    private toastService: ToastService,
    private favoritesService: FavoritesService,
    private registerService: RegisterService,
    private router: Router,
    public  parametersService: ParametersService,
    public locationService: LocationService,
  ) {}

  ngOnInit() {

    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
    }

    this.mostrarAsteriscoIndicativo = false;
    this.adService.setTitle(titles.register);

    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
      this.adService.setMetaTags({
        title: data?.seo?.title,
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords
      });
    });
    this.parametersService.getCompanyParameters().toPromise().then((company) => {
      this.paramestroRegistro = company.config?.data?.register;
      this.initFieldsForm();
    });

    this.parametersService.getCompanyParameters().subscribe((page) => {

      if (typeof page.info.company.SolicitarBarrioRegistro !== 'undefined') {
        if (page.info.company.SolicitarBarrioRegistro) {
          this.dataForm.SolicitarBarrioRegistro = true;
        } else {
          this.dataForm.SolicitarBarrioRegistro = false;
        }
        this.switchNeighborhoodValidation();
      }
    });


    this.switchIndicativeValidation();
  }
  /*searchNeighborhoodByQuery = (query$: Observable<string>) =>
    query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.locationService.getNeighborhoodByQuery(term, this.cityId, 'sin cobertura'))
    )*/

  initFieldsForm() {

    // Tipos de identificación
    this.registerService.getIdentificationsTypes().subscribe((data: any) => {
      this.identificationsTypes = (data);
    });

    // Obtiene el mensaje a mostrar cuando hay error en fecha de nacimiento
    this.registerService.getRegisterMessage().subscribe((response: any) => {
      this.registerFormFeedback.birthdate.minor = response[0].contenido;
    });

    this.registerService.getEconomicActivities().subscribe((data: any) => {
      this.economicActivities = data;
    });

    this.searchLocationSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((text) => {
      this.resetSearch();
      if (text.length < 3) {
        return;
      }
      this.cartService.searchLocationByText({
        searchText: text,
        citiesERP: true
      }).subscribe((response: any) => {
        this.dataForm.loadingLocationsByFastSearch = false;
        this.dataForm.loadedLocationsByFastSearch = true;
        this.dataForm.locationsByFastSearch = response;
      });
    });


    this.searchNeighborhoodSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((text) => {
      this.resetSearchNeighborhood();
      if (text.length < 3) {
        return;
      }
      this.locationService.getNeighborhoodByQuery(text, this.cityId, 'sin cobertura').subscribe((response: any) => {
        this.dataForm.loadingNeighborhoodsByFastSearch = false;
        this.dataForm.loadedNeighborhoodsByFastSearch = true;
        this.dataForm.NeighborhoodsByFastSearch = response;
      });
    });

    this.setPeopleValidators();
    this.registerForm.controls.type.valueChanges.subscribe((type) => {
      this.registerForm.clearValidators();
      this.registerForm.clearAsyncValidators();
      if (type === 'personas') {
        this.setPeopleValidators();
      } else {
        this.setBusinessValidators();
      }
      this.updateFormValidations();
    });

    this.registerForm.controls.email.valueChanges.subscribe(() => {
      this.registerForm.controls.emailConfirmation.updateValueAndValidity();
    });

    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.passwordConfirmation.updateValueAndValidity();
    });
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);

    return (control.invalid && (control.dirty || control.touched));
  }

  getFeedback(field: string): string {
    const control = this.registerForm.get(field);

    if (control.errors) {
      const errors = Object.keys(control.errors);

      if (errors && this.registerFormFeedback[field]) {
        return this.registerFormFeedback[field][errors[0]];
      }
    }

    return '';
  }

  /**
   * Valida que el documento ingresado no este siendo usado
   */
  documentAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.registerService.validateUserId(control.value).pipe(
      map((response: any) => (response.error) ? {document: true} : null),
      catchError(() => of(null))
    );
  }

  /**
   * Valida que no se este intentando registrar un menor de edad
   */
  birthDateValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = moment(control.value, 'YYYY-MM-DD');

    if (birthDate.isValid()) {
      const years = moment().diff(birthDate, 'years');

      return (years >= 18) ? null : {minor: true};
    }

    return {minor: true};
  }

  /**
   * Valida que el email ingresado no este siendo usado
   */
  emailAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.registerService.validateEmail(control.value).pipe(
      map((response: any) => (response.error) ? {used: true} : null),
      catchError(() => of(null))
    );
  }

  compareEmailsValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value !== control?.parent?.get('email')?.value) {
      return {compare: true};
    }

    return null;
  }

  comparePasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value !== control?.parent?.get('password')?.value) {
      return {compare: true};
    }

    return null;
  }

  changeTypeForm(typeForm: 'personas' | 'empresas') {
    this.registerForm.controls.type.setValue(typeForm);
  }

  clearPeopleValidators() {
    const fields = [
      'firstName',
      'lastName',
      'typeId',
      'numberId',
      'gender',
      'birthdate'
    ];

    fields.forEach((field) => {
      const control = this.registerForm.get(field);

      control.clearValidators();
      control.clearAsyncValidators();
      control.updateValueAndValidity();
    });
  }

  setPeopleValidators() {
    this.clearBusinessValidators();
    this.registerForm.controls.firstName.setValidators(Validators.required);
    this.registerForm.controls.firstName.setValidators(Validators.minLength(3));
    this.registerForm.controls.lastName.setValidators(Validators.required);
    this.registerForm.controls.lastName.setValidators(Validators.minLength(3));
    this.registerForm.controls.typeId.setValidators(Validators.required);
    this.registerForm.controls.numberId.setValidators(Validators.required);
    this.registerForm.controls.numberId.setValidators(Validators.minLength(7));
    this.registerForm.controls.numberId.setAsyncValidators(this.documentAsyncValidator.bind(this));
    this.registerForm.controls.gender.setValidators(Validators.required);
    if(!this.paramestroRegistro?.ocultarFechaNocimientoRegistro){
      this.registerForm.controls.birthdate.setValidators([Validators.required, this.birthDateValidator]);
    }
  }

  clearBusinessValidators() {
    const fields = [
      'businessName',
      'nit',
      'activity',
      'dv',
      'firstNameContactPerson',
      'lastNameContactPerson',
    ];

    fields.forEach((field) => {
      const control = this.registerForm.get(field);

      control.clearValidators();
      control.clearAsyncValidators();
    });
  }

  setBusinessValidators() {
    this.clearPeopleValidators();
    this.registerForm.controls.businessName.setValidators(Validators.required);
    this.registerForm.controls.nit.setValidators(Validators.required);
    this.registerForm.controls.nit.setAsyncValidators(this.documentAsyncValidator.bind(this));
    this.registerForm.controls.activity.setValidators(Validators.required);
    this.registerForm.controls.dv.setValidators(Validators.required);
    this.registerForm.controls.firstNameContactPerson.setValidators(Validators.required);
    this.registerForm.controls.lastNameContactPerson.setValidators(Validators.required);
  }

  updateFormValidations() {
    for (const field in this.registerForm.controls) {
      if (this.registerForm.controls.hasOwnProperty(field) && field !== 'type') {
        const control = this.registerForm.controls[field];

        control.updateValueAndValidity();
      }
    }
  }

  checkFields() {
    const controls = this.registerForm.controls;

    for (const field in controls) {
      if (controls.hasOwnProperty(field)) {
        const control = controls[field];

        if (control.invalid && !control.dirty) {
          control.markAsDirty();
        }
      }
    }
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.checkFields();
      return this.toastService.warning('Aun hacen falta campos por diligenciar');
    }

    this.loading = true;
    this.registerService.registerUser(this.registerForm.value).subscribe((data: any) => {
      if (data) {
        if(data.error){
          let mensaje:any;
          mensaje = data.message;

          if(data.errors != '' && data.errors != null){
            mensaje=data.errors[0];
          }
          this.toastService.warning(mensaje);
        }else{
          const username = this.registerForm.value.emailConfirmation;
          const password = this.registerForm.value.passwordConfirmation;
          this.loginRegister(username, password);
          this.toastService.success('Tu registro se realizo exitosamente');
        }
      }
    }, (error: any) => {
      if (error.status === 500 || error.status === 0) {
        this.router.navigate(['/500']);
      }
    }, () => {
      this.loading = false;
    });
  }

  setSearchTerm(term: string) {

      this.searchLocationSubject.next(term);

  }

  setSearchTermNeighborhood(term: string) {

      this.searchNeighborhoodSubject.next(term);

  }

  resetSearch() {
    this.dataForm.locationSelected = false;
    this.dataForm.locationsByFastSearch = [];

    this.registerForm.get('country').setValue('');
    this.registerForm.get('state').setValue('');
    this.registerForm.get('city').setValue('');
    this.dataForm.searchNeighborhoodText = '';
    this.resetSearchNeighborhood();
    this.dataForm.loadingLocationsByFastSearch = false;
    this.dataForm.loadedLocationsByFastSearch = false;
    this.dataForm.errorLoadingLocationsByFastSearch = false;

    this.dataForm.loadingLocationsByFastSearch = true;
  }

  resetSearchNeighborhood() {
    this.dataForm.NeighborhoodSelected = false;
    this.dataForm.NeighborhoodsByFastSearch = [];
    this.registerForm.get('neighborhood').setValue('');
    this.dataForm.loadingNeighborhoodsByFastSearch = false;
    this.dataForm.loadedNeighborhoodsByFastSearch = false;
    this.dataForm.errorLoadingNeighborhoodsByFastSearch = false;

    this.dataForm.loadingNeighborhoodsByFastSearch = true;

  }

  setLocationCity(location: any) {
    this.registerForm.get('country').setValue(location.countryId);
    this.registerForm.get('state').setValue(location.stateId);
    this.registerForm.get('city').setValue(location.cityId);
    this.cityId = location.cityId;
    this.dataForm.locationSelected = true;
    this.dataForm.searchLocationText = location.cityName + ', ' + location.stateName + ' - ' + location.countryName;

  }
  setNeighborhood(ne: any){
    this.registerForm.get('neighborhood').setValue(ne.id);
    this.dataForm.searchNeighborhoodText = ne.nombre;
    this.dataForm.NeighborhoodSelected = true;
  }
  loginRegister(userName: string, password: string) {
    this.authService.login(userName, password).subscribe((authResponse: any) => {

      if (authResponse.data) {
        if (authResponse.data.isLogged) {

          // Almacenar usuario
          localStorage.setItem('currentUser', JSON.stringify(authResponse.data));
          this.authService.setCurrentUser(authResponse.data);
          this.favoritesService.getResumeProductsFavorites(authResponse.data.userId).subscribe((favoritesResponse: any) => {
            authResponse.data.favoriteItems = favoritesResponse;
            this.cartService.getShoppingCartSummary(true).subscribe((cartResponse: any) => {
              if (cartResponse.cartUnified) {
                this.toastService.info(
                  'Los ítems de la canasta se han unificado con una canasta que ya tenia creada anteriormente.'
                );
              }
            });
          });

          this.toastService.success(authResponse.message);
          this.router.navigate(['/']);
        }
      } else {
        this.authService.setCurrentUser(null);
        this.toastService.error(authResponse.message);
      }
    }, error => {
      if (error.status === 500 || error.status === 0) {
        this.router.navigate(['/500']);
      }
    });
  }

  /*
* Switch neighborhood field required validation
* */
  private switchNeighborhoodValidation() { //console.log("llega");
    this.parametersService.getCompanyParameters().subscribe((page) => {

      if(typeof page.info.company.SolicitarBarrioRegistro != 'undefined') { //console.log("llega 2");
        if (page.info.company.SolicitarBarrioRegistro) { //console.log("llega 3");
          this.registerForm.get('neighborhood').clearValidators();
          this.registerForm.get('neighborhood').setValidators([Validators.required, Validators.min(1)]);

        } else { //console.log(" no llega ");
          this.registerForm.get('neighborhood').clearValidators();

        }
        this.registerForm.get('neighborhood').updateValueAndValidity();
      }
    });
  }

/*
* Switch indicative field required validation
* */
  private switchIndicativeValidation() {
    this.parametersService.getCompanyParameters().subscribe((page) => {

      if(typeof page.info.company.validaIndicativoRegistro !== 'undefined') {
        if (page.info.company.validaIndicativoRegistro) {
          this.registerForm.get('indicative').clearValidators();
          this.registerForm.get('indicative').setValidators([Validators.min(1),
            Validators.maxLength(4)]);
            this.mostrarAsteriscoIndicativo = false;
        } else {
          this.registerForm.get('indicative').setValidators([Validators.required, Validators.min(1), Validators.maxLength(4)]);
          this.mostrarAsteriscoIndicativo = true;
        }
        this.registerForm.get('indicative').updateValueAndValidity();
      }
    });
  }
}

