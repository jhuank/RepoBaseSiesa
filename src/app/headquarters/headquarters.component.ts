import { Component, OnInit } from '@angular/core';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { ActivatedRoute } from '@angular/router';
import { HeadquartersService } from '@core/services/headquarters/headquarters.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { isArray } from 'util';
import { titles } from '@config/titles.constants';

@Component({
  templateUrl: '../../templates/headquarters/headquarters.component.html',
  styleUrls: ['../../templates/headquarters/headquarters.component.scss']
})
export class HeadquartersComponent implements OnInit {
  public headquarters: {
    name: any,
    sedes: any,
    isOpen: any
  }[] = [];
  public cmsData: any; 
  public page = 'PAG-41';
 
  constructor(
    public parametersService: ParametersService,
    public headquartersService: HeadquartersService,
    private adService: AdvertisementsService
  ) { }

  ngOnInit(): void {
    this.adService.setTitle(titles.headquartersMainPage); 
    this.getHeadquarters();
  }

  getHeadquarters() {
    this.headquartersService.getContactLocations().subscribe((response) => {
      let content = 1;
      for (const key in response) {
        if (response.hasOwnProperty(key)) {
          const value = response[key];
          this.headquarters.push({
            name: key,
            sedes: value,
            isOpen: (content === 1) ? true : false
          });
          content++;
        }
      }
    });
  }


}
