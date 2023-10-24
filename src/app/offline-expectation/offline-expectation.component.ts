import { Component, OnInit, ViewEncapsulation, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { EnvService } from '@core/services/env/env.service';
declare var $: any;

@Component({
  templateUrl: './offline-expectation.component.html',
  styleUrls: ['./offline-expectation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OfflineExpectationComponent implements OnInit {
  endOffline: string;
  flagOffline: boolean;
  page = 'PAG-39';
  cmsData: any;

  constructor(
    private envService: EnvService,
    public parametersService: ParametersService,
    private router: Router,
    private renderer: Renderer2,
    public advertisementService: AdvertisementsService
  ) {
    if (this.envService.isBrowser) {
      this.router.events.subscribe(event => {
        const appOfflineExpectation = document.getElementsByTagName('app-offline-expectation');
        if (appOfflineExpectation.length >= 1) {
          this.renderer.addClass(document.body, 'offline-wrapper');
        }
      });
    }
  }

  ngOnInit() {
    // this.parametersService.page$.subscribe((page) => {
    //   this.flagOffline = page.pageOnline;
    //   this.endOffline = page.offlineTime;

    //   $('#clock').countdown(this.endOffline, function (event) {
    //     const $this = $(this).html(event.strftime(`
    //       <div class="simply-section d-flex align-content-center justify-content-center flex-wrap white-text-color">
    //         <span class="w-100 simply-amount">%w</span> semanas
    //       </div>
    //       <div class="simply-section d-flex align-content-center justify-content-center flex-wrap white-text-color">
    //         <span class="w-100 simply-amount">%d</span> dias
    //       </div>
    //       <div class="simply-section d-flex align-content-center justify-content-center flex-wrap white-text-color">
    //         <span class="w-100 simply-amount">%H</span> hr
    //       </div>
    //       <div class="simply-section d-flex align-content-center justify-content-center flex-wrap white-text-color">
    //         <span class="w-100 simply-amount">%M</span> min
    //       </div>
    //       <div class="simply-section d-flex align-content-center justify-content-center flex-wrap white-text-color">
    //         <span class="w-100 simply-amount">%S</span> sec
    //       </div>
    //     `));
    //   });

    //   if (this.flagOffline) {
    //     this.router.navigate(['/login']);
    //   }

    // });
    // this.advertisementService.getAdvertisements(this.page).subscribe((data: any) => {
    //   this.cmsData = data;
    // });



     // Obtener los parámetros de la pagina
    this.parametersService.getPageParameters().subscribe((page) => {
      console.log("page---",page);
      if (page.pageOnline) {
        this.router.navigate(['/']);
      }
    });
  }

}
