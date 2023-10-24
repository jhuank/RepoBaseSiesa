import { Component, OnInit } from '@angular/core';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { ActivatedRoute , Router} from '@angular/router';
import { EventsDetailService } from '@core/services/events-detail/events-detail.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';

@Component({
  selector: 'app-events-detail',
  templateUrl: '../../templates/events-detail/events-detail.component.html',
  styleUrls: ['../../templates/events-detail/events-detail.component.scss']
})
export class EventsDetailComponent implements OnInit {

  public id:string;
  public event:any;
  public page = "PAG-42";
  public cmsData: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public parametersService: ParametersService,
              public eventsDetailService: EventsDetailService,
              private adService: AdvertisementsService) { }

  ngOnInit(): void {

    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
    });

    this.route.params
    .subscribe( parametros => {
        this.id = parametros.id;
        this.getInfoEvent();
    });
  }

  getInfoEvent() {
    this.eventsDetailService.getEvent(this.id).subscribe( (response: any) => {
      if (response.error) {
        this.router.navigate(['']);
      } else {
        this.event = response.data[0];
        this.adService.setMetaTags({title: this.event.nombre ,
          meta_description: this.event.descripcion,
          image: this.event.imagenPrincipal,
          og_title: this.event.nombre,
          og_description: this.event.descripcion,
          keywords: ''});
      }
    } );
  }

}
