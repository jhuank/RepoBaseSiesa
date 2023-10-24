import {Component, Input, OnInit} from '@angular/core';
import {OrderService} from '@core/services/order/order.service';
import {ToastService} from '@core/services/toast/toast.service';

@Component({
  selector: 'app-shopping-experience',
  templateUrl: '../../templates/shopping-experience/shopping-experience.component.html',
  styleUrls: ['../../templates/shopping-experience/shopping-experience.component.sass']
})
export class ShoppingExperienceComponent implements OnInit {
  @Input() public orderId: any;
  public alreadySend: boolean;
  constructor(
    public orderService: OrderService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.alreadySend = false;
  }
  experienceRequest(comment, rating) {
    
    if(+rating < 1) return this.toastService.error('Seleccione el número de estrellas de 1 a 5.', { delay: 3000});

    this.orderService.sendExperienceComment({orderId: this.orderId,
    qualification: rating,
    commentary: comment}).subscribe((response: any) => {
      if (!response.error) {
        this.alreadySend = true;
      }
    });
  }
}
