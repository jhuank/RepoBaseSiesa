import { NgModule } from '@angular/core';
// import { Title, Meta } from '@angular/platform-browser';


// Services
import { EnvService } from '@core/services/env/env.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { CommonService } from '@core/services/common/common.service';


@NgModule({
  declarations: [],
  providers: [
    EnvService,
    ParametersService,
    CommonService
  ],
  imports: []
})
export class CoreModule { }
