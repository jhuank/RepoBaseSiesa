import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, switchMap, catchError, pluck, map } from 'rxjs/operators';
import { CartService } from '@core/services/cart/cart.service';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
    template: `<div></div>`
})
export class LoadCart implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cartService: CartService,
        private switchSpinnerService: SwitchSpinnerService,
        private authService: AuthService
    ) {
        
    }

    ngOnInit() {
        this.switchSpinnerService.on();
        this.route.params.pipe(
            pluck('id'),
            map((id) => {
                if(isNaN(parseInt(id, 10))){
                    throw 'id no válido';
                }
                return id; 
            }),
            tap(id => this.router.navigate(['order', {orderId: id}])),
            switchMap((id) => this.cartService.getShoppingCartSummary(false, id)),
            tap((response) => {
                if(!response.error && response.ownerUserId != +this.authService.getUserId()) this.authService.logout();
            }),
            tap(() => this.switchSpinnerService.off()),
            catchError(err => this.router.navigate(['404']))
        )  
        .subscribe((params) => {});
    } 
}
