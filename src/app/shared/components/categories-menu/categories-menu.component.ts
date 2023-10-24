import { Component, OnInit } from '@angular/core';
import {MainService} from '../../services/main.service';

@Component({
  selector: 'app-categories-menu',
  templateUrl: './categories-menu.component.html',
  styleUrls: ['./categories-menu.component.sass']
})
export class CategoriesMenuComponent implements OnInit {
  public categoriesMenu:any;
  constructor(private mainService: MainService) { }

  ngOnInit() {
    this.categoriesMenu = JSON.parse(localStorage.getItem('CategoriesMenu'));
  }

}
