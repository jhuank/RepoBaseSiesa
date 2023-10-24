import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from '@core/services/toast/toast.service';
import {ParametersService} from '@core/services/parameters/parameters.service';
import {AuthService} from '@core/services/auth/auth.service';
import {tap} from 'rxjs/operators';
import {AdvertisementsService} from '@shared/services/advertisements/advertisements.service';
import {titles} from '@config/titles.constants';

@Component({
  selector: 'app-login',
  templateUrl: '../../templates/password/password.component.html',
  styleUrls: ['../../templates/password/password.component.scss']
})
export class PasswordComponent implements OnInit {
  public recoveryPasswordDataLoading: boolean;
  public cms: any;
  public recoveryPasswordForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^([a-zA-Z0-9_.+-])+\\@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$')
    ]),
    captcha: new FormControl('', Validators.required)
  });
  public recoveryPasswordFormFeedback = {
    email: {
      pattern: 'El correo tiene un formato incorrecto',
      required: 'Debe ingresar un correo electrónico válido'
    }
  };
  public cmsContrasenaIntro: any;
  public cmsContrasenaTips: any;

  constructor(
    public parametersService: ParametersService,
    private adService: AdvertisementsService,
    public authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.cmsContrasenaIntro = '';
    this.cmsContrasenaTips = '';
    this.getCmsRecuperarContrasena();
  }


  ngOnInit() {
    this.adService.setTitle(titles.restorePassword);
  }

  checkFields() {
    const controls = this.recoveryPasswordForm.controls;

    for (const field in controls) {
      if (controls.hasOwnProperty(field)) {
        const control = controls[field];

        if (control.invalid && !control.dirty) {
          control.markAsDirty();
        }
      }
    }
  }

  sendRecoveryPassword() {
    this.recoveryPasswordDataLoading = true;

    if (this.recoveryPasswordForm.invalid) {
      this.checkFields();
      this.recoveryPasswordDataLoading = false;

      if (this.recoveryPasswordForm.controls.email.errors?.pattern) {
        return this.toastService.warning(this.recoveryPasswordFormFeedback.email.pattern, {delay: 5000});
      }

      return this.toastService.warning('Aun hacen falta campos por diligenciar', {delay: 5000});
    }

    const {email} = this.recoveryPasswordForm.value;

    this.authService.recoveryPassword(email)
      .pipe(tap(() => this.recoveryPasswordDataLoading = false))
      .subscribe((passResponse: any) => {
        if (passResponse.error) {
          return this.toastService.error(passResponse.message);
        }

        this.router.navigate(['/login']);
        this.toastService.success('Se ha enviado una nueva clave de acceso a su correo');
      });
  }

  getCmsRecuperarContrasena() {
    this.authService.getCmsRestablecerContrasena().subscribe(
      returned => {
        this.cmsContrasenaIntro = returned?.RESTABLECER_PASSWORD_INTRO;
        this.cmsContrasenaTips = returned?.RESTABLECER_PASSWORD_TIP;
      }
    )
  }
}
