
import { CartService } from '@core/services/cart/cart.service';
import { Meta, DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { isPlatformServer, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { EnvService } from '@core/services/env/env.service';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AdvertisementsService } from './shared/services/advertisements/advertisements.service';
import { ModalService } from '@core/services/modal/modal.service';
import {MainService} from '@shared/services/main.service';
import {LocationService} from '@core/services/location/location.service';

@Component({
  selector: 'app-root',
  templateUrl: '../templates/app.component.html',
  styleUrls: ['../templates/app.component.scss']
})
export class AppComponent implements OnInit {
  public cmsData: any;
  public page = 'PAG-68';
  public activeBotton = false;
  @ViewChild('modalAge') private modalAge: TemplateRef<any>;
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: ModalService,
    private adService: AdvertisementsService,
    private envService: EnvService,
    public parametersService: ParametersService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private mainService: MainService,
    private locationService: LocationService,
    private gtmService: GoogleTagManagerService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     if (isPlatformBrowser(this.platformId)) {
    //       if (event.url.indexOf('backend') > -1) {
    //         window.location.href = `${this.env.apiGatewayBackOffice}`;
    //       }
    //     }
    //   }
    // });

    this.envService.isBrowser = isPlatformBrowser(this.platformId);
    this.envService.isServer = isPlatformServer(this.platformId);

    // Establecer cliente
    this.parametersService.setClient();

    // Obtener los parámetros de la compañía
    this.parametersService.getCompanyParameters().toPromise().then((company) => {
      if (this.envService.isBrowser) {
        // favicon
        this.changeFavicon(company.info.company.favicon);

        // Modal de edad
        if (company.config.mostrarModalConfirmaciónMayorEdad) {
          const acceptAge = localStorage.getItem('acepAge');

          if (acceptAge !== '1') {
            this.openModAlage();
          }
        }
      }
    });

    // Obtener los parámetros de la pagina
    this.parametersService.getPageParameters().subscribe((page) => {
      if (!page.pageOnline) {
        this.router.navigate(['/', 'offline-expectation']);
      }
    });

    // obtener usuario (solo navegador)
    this.authService.findAndSetUserInStorage();

    if (this.envService.isBrowser) {
      // Obtener la canasta



      this.cartService.getShoppingCartSummary().toPromise().then();

      this.router.events.forEach(item => {
        if (item instanceof NavigationEnd) {
          const gtmTag = {
            event: 'page',
            pageName: item.url
          };
          this.gtmService.pushTag(gtmTag);
        }
      });

    }
    // 3. En caso de no haber canasta ni coverage delivery. llamar get coverage delivery

  }

  changeFavicon(favicon: string) {
    const faviconElement: any = this.document.querySelector('[app-favicon]');

    faviconElement.href = favicon;
  }

  openModAlage() {
    this.adService.getAdvertisements(this.page).subscribe((data: any) => {

      let html: any = data.espacios[1].html;
      html = this.sanitizer.bypassSecurityTrustHtml(html)
      this.cmsData = html;
      this.modalService.open(this.modalAge, { close: false });
    });
  }
  acepAge() {
    if (this.envService.isBrowser) {
      localStorage.setItem('acepAge', '1');
      this.modalService.dismiss();
    }
  }

  changeAge(arg) {
    if (arg.checked) {
      this.activeBotton = true;
    } else {
      this.activeBotton = false;
    }
  }
}
