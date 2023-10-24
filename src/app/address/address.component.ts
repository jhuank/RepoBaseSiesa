import { Component, OnInit } from '@angular/core';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { RegisterService } from '../services/register.service';
import { FormBuilder } from '@angular/forms';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { AddressService } from '@core/services/address/address.service';
import { ToastService } from '@core/services/toast/toast.service';
import {AuthService} from '@core/services/auth/auth.service';
import {Router} from '@angular/router';
import { titles } from '@config/titles.constants';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';
import { take } from 'rxjs/operators';
import { EnvService } from '@core/services/env/env.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-address',
  templateUrl: '../../templates/address/address.component.html',
  styleUrls: ['../../templates/address/address.component.scss']
})
export class AddressComponent implements OnInit {

  public newDirection: {
    nombre: string,
    ciudad: string,
    ciudadId: string,
    locationsByFastSearch: any,
    direccion: any,
    pending: string,
    principal: string,
  };
  public directions: {
    id: string,
    nombre: string,
    ciudad: string,
    ciudadId: string,
    locationsByFastSearch: [],
    direccion: string,
    pending: number,
    principal: number,
  }[] = [];
  public user: any = null;
  public showError: any = null;
  public showSuccess: any = null;
  public showErrorAlone: any = null;
  public directionSave: any = null;
  public locationsByFastSearch = [];
  public directionForm: {
    pending: string;
    principal: string;
  };

  public resetValidationsSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private adService: AdvertisementsService,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    public parametersService: ParametersService,
    public addressService: AddressService,
    public authService: AuthService,
    public switchSpinnerService: SwitchSpinnerService,
    private envService: EnvService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.switchSpinnerService.on();
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.switchSpinnerService.off();

      if (user) {
        this.user = user;
        this.initDirection();
        this.getAllDirections();
      } else {
        if (this.envService.isBrowser) {
          this.router.navigate(['/login']);
        }
      }
      this.resetValidationsSubject.next(false);
    });
    

    this.adService.setMetaTags({
      title: titles.address,
      meta_description: 'Editar Direcciones',
      image: '',
      og_title: 'Mis direcciones',
      og_description: 'Editar Direcciones',
      keywords: ''
    });
  }

  getAllDirections() {
    this.addressService.getAllDirections(this.authService.getUserId(), '').subscribe((response: any) => {
      this.directions = response.data;
    });
  }

  selectFavorite(address) {
    if (!address.principal) {
      if (address.id && !this.directions.some((val) => {
        return val.principal && val.id !== address.id;
      })) {
        address.principal = true;
        this.toastService.error('Debes tener una dirección como principal');
      }
    } else if (this.directions.length) {
      if (this.directions.some((val) => {
        return val.principal && val.id !== address.id;
      })) {
        address.pending = true;
        // showConfirmPrincipalDirection(address);
      }
    }
  }

  principalDirection(response) {
    if (this.newDirection.pending) {
      delete this.newDirection['pending'];
      this.newDirection.principal = response;
    }

    this.directions.forEach((address) => {
      if (address.pending) {
        delete address['pending'];
        address.principal = response;
      }
    });
  }

  getLocationsByFastSearch(address) {

    this.resetValidationsSubject.next(true);

    if (!address.ciudad) {
      address.ciudadId = null;
      address.directionSave = null;
      address.locationsByFastSearch = [];
      return;
    }
    address.ciudadId = null;
    address.directionSave = null;
    if (address.ciudad.length > 3) {
      address.locationsByFastSearch = [];

      this.addressService.locationBySearchText(address.ciudad).subscribe((response) => {
        address.locationsByFastSearch = response;
      });
    }
  }

  setLocationCity(location, address) {
    address.ciudad = location.cityName + ', ' + location.stateName + ' - ' + location.countryName;
    address.ciudadId = location.cityId;
    address.directionSave = location;
    address.locationsByFastSearch = [];
  }

  addDirection() {
    this.saveDirection(this.newDirection)
      .then((response: any) => {

        if (!response.error) {
          // TODO:  this.initComponents();
        }

        /**
         * TODO: this.$timeout(() => {
         *  this.showSuccess = null;
         *  this.showErrorAlone = null;
         * }, 1500);
         */
      })
      .catch((error) => console.error(error));

  }

  saveDirection(address) {
    if (this.validateDirection(address)) {
      return new Promise((resolve, reject) => {
        if (address && address.ciudadId) {
          //TODO: let data = angular.copy(address);
          let data = address;
          data.usuarioId = this.user.userId;
          data.principal = address.principal ? 1 : 0;

          this.addressService.saveDirection(data).subscribe((response: any) => {

            if (response.error) {
              this.toastService.error(response.message);
            } else {
              this.toastService.success(response.message);
              this.clearForm(address);
            }
            resolve(response);
            this.ngOnInit();
          });
        } else {
          reject(new Error('Error procesando datos.'));
          // showRegisterErrorsModal();
        }
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    }
  }

  validateDirection(address) {
    let message = '';
    let flag = true;
    if (address.nombre.length <= 0) {
      message = message + '<li>Ingrese el nombre de la dirección</li>';
      flag = false;
    }
    if (!address.ciudadId || address.ciudadId?.length <= 0) {
      message = message + '<li>Ingrese la ciudad de la dirección</li>';
      flag = false;
    }
    if (address.direccion.length <= 0) {
      message = message + '<li>Ingrese la dirección</li>';
      flag = false;
    }
    if (!flag) {
      this.toastService.error(`<h5>Faltan algunos datos por diligenciar</h5><ul>${message}</ul>`);
    }
    return flag;
  }

  clearForm(address) {
    this.initDirection();
    address.locationsByFastSearch = [];
    // TODO: this.directionForm.$setPristine();
  }

  initDirection() {
    this.newDirection = {
      nombre: '',
      ciudad: '',
      ciudadId: null,
      locationsByFastSearch: '',
      direccion: '',
      pending: null,
      principal: null,
    };
  }

  deleteDirection(address) {
    if (address.principal) {
      this.toastService.error('Debes tener una dirección como principal');
    } else {
      this.addressService.deleteDirection(address.id).subscribe((response: any) => {
        if (response.error) {
          this.toastService.error(response.message);
        } else {
          this.toastService.success('Dirección eliminada correctamente');
          // TODO: this.initComponents();
        }
        this.ngOnInit();
      });
    }
  }

  get validationsIsReset(): boolean {
    return this.resetValidationsSubject.value;
  }

  resetValidations(value: boolean): void {
    this.resetValidationsSubject.next(value);
  }

}
