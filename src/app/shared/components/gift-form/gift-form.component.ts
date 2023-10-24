import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LocationService }  from '@core/services/location/location.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { CustomParam } from '@core/models/cart.model';

@Component({
  selector: 'app-gift-form',
  // templateUrl: './gift-form.component.html',
  templateUrl: '../../../../templates/shared/components/gift-form/gift-form.component.html',
  // styleUrls: ['./gift-form.component.scss']
})
export class GiftFormComponent implements OnInit {

  public customProperties: CustomParam = new CustomParam();

  giftForm = new FormGroup({
    de: new FormControl('', [
      Validators.maxLength(50),
      // Validators.required,
    ]),
    para: new FormControl('', [
      Validators.maxLength(50),
      // Validators.required,
    ]),
    mensaje: new FormControl('', [
      Validators.maxLength(250),
      // Validators.required,
    ]),
  });

  constructor(
    public locationService: LocationService,
    public parametersService: ParametersService,
  ) {
  }

  ngOnInit(): void {
    var test = this.parametersService.getSingleParamInStorage('giftForm', 'de').subscribe((response : CustomParam) => {
      this.customProperties = response;  
      if(this.customProperties) {
        this.giftForm.patchValue({
          de: this.customProperties?.de,
          para: this.customProperties?.para,
          mensaje: this.customProperties?.mensaje,
        });
      }
    });
  
  }

  onSubmit() {
    if(this.giftForm.valid) {
      this.parametersService.setSingleParamInStorage('giftForm', this.giftForm.value);
    }
    this.locationService.closeCustomModal();
  }
  
  validateStringIfEmpty(string: string): boolean {
    return string.length === 0;
  }

  onChange(): void {
    let deValue = this.giftForm.get('de').value;
    let paraValue = this.giftForm.get('para').value;
    let mensajeValue = this.giftForm.get('mensaje').value;

    if(this.validateStringIfEmpty(deValue) && this.validateStringIfEmpty(paraValue) && this.validateStringIfEmpty(mensajeValue)) {
      this.giftForm.get('de').clearValidators();
      this.giftForm.get('para').clearValidators();
      this.giftForm.get('mensaje').clearValidators();
    }
    else {
      this.giftForm.get('de').setValidators([Validators.required]);
      this.giftForm.get('para').setValidators([Validators.required]);
      this.giftForm.get('mensaje').setValidators([Validators.required]);
    }
    this.giftForm.get('de').updateValueAndValidity();
    this.giftForm.get('para').updateValueAndValidity();
    this.giftForm.get('mensaje').updateValueAndValidity();

  }

  get para() {
    return this.giftForm.get('para');
  }
  
  get de() {
    return this.giftForm.get('de');
  }

  get mensaje() {
    return this.giftForm.get('mensaje');
  }
  
}
