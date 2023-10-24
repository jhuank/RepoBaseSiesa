import { Component, OnInit } from '@angular/core';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { ActivatedRoute } from '@angular/router';
import { HeadquartersService } from '@core/services/headquarters/headquarters.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-headquarters-detail',
  templateUrl: '../../templates/headquarters-detail/headquarters-detail.component.html',
  styleUrls: ['../../templates/headquarters-detail/headquarters-detail.component.scss']
})

export class HeadquartersDetailComponent implements OnInit {
  public operatingCenterData: any;
  public headquarter: any;
  public cmsData: any;
  public map = {
    latitude: 3.484781,
    longitude: -76.514930,
    mapType: 'roadmap',
    zoom: 8
  };

  constructor(
    private route: ActivatedRoute,
    public parametersService: ParametersService,
    public headquartersService: HeadquartersService,
    private adService: AdvertisementsService
  ) { }

  ngOnInit(): void {
    this.adService.getAdvertisements('PAG-41').subscribe((data: any) => {
      this.cmsData = data; 
    });

    this.route.params.pipe(
      map(params => params.id),
      switchMap(id => this.headquartersService.getContactLocations(id))
    ).subscribe((response) => {
      for (const key in response) {
        if (response.hasOwnProperty(key)) {
          const value = response[key];
          this.operatingCenterData = value[0];
          this.adService.setTitle(this.operatingCenterData?.name || 'Sede');
          this.operatingCenterData.city = key;
          this.map.latitude = +this.operatingCenterData.latitude;
          this.map.longitude = +this.operatingCenterData.longitude;
        }
      }
    });
  }
}
