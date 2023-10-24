import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LocationService } from '@core/services/location/location.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { ParametersService } from '@core/services/parameters/parameters.service';


@Component({
  selector: 'app-custom-modal',
  templateUrl: '../../../../templates/shared/components/custom-modal/custom-modal.component.html',
  // styleUrls: ['./custom-modal.component.scss'] 
})
export class CustomModalComponent implements OnInit, AfterViewInit {

  @ViewChild('customModal') customModal: NgxSmartModalComponent;

  constructor(
    public locationService: LocationService,
    private ngxSmartModalService: NgxSmartModalService,
    public parametersService: ParametersService
  ) { } 

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.locationService.modal2 = this.customModal;
  }

}
