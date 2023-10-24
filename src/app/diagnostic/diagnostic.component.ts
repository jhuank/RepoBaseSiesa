import { Component, OnInit } from '@angular/core';
import {ParametersService} from '@core/services/parameters/parameters.service';
import {PrettyjsonPipe} from '../pipes/prettyjson.pipe';
import {CartService} from '@core/services/cart/cart.service';
import {LocationService} from '@core/services/location/location.service';
import {AuthService} from '@core/services/auth/auth.service';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.scss'],
})
export class DiagnosticComponent implements OnInit {

  constructor(
    public parametersService: ParametersService,
    public cartService: CartService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
  }
  returnvalue(variable) {
    let prueba = '';
    if (typeof variable === 'object') {
      return JSON.stringify(variable);
    } else {
      return variable;
    }
  }

}
