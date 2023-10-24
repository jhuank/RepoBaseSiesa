import { Directive , Input , ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appMenu]'
})
export class MenuDirective implements OnInit {
  @Input() items: any;
  public menustring = '';
  constructor(private elementRef: ElementRef) {
  }
  ngOnInit() {
    this.menu(this.items);
    this.elementRef.nativeElement.insertAdjacentHTML('beforeend',
      this.menustring);
  }
  menu(items: any) {
    items.forEach(dato => {
      this.menustring += '<li>' +
        this.menuitems(dato) +
        '     </li>';
    });
  }
  menuitems(item: any) {
    let itemstring = '';

      if (item.url_destino) {
        itemstring = '<a href="' + item.url_destino + '">' +
           item.nombre +
          '      </a>';
      } else if (!item.url_destino && !item.hijas.length) {
        itemstring = '<a  ui-sref="home.categorySlugProducts({categorySlug:item.slug})">' +
          item.nombre +
          '</a>';
      } else if (!item.url_destino && item.hijas.length) {
        itemstring = '<a *ngIf="!item.url_destino && item.hijas.length" ui-sref="home.categorySlug({categorySlug:item.slug})">\n' +
          item.nombre +
          '      </a>\n' +
          '      <ul *ngIf="!item.url_destino && item.hijas.length" class="dropdown list-unstyled">\n' +
          '\n' +
          '      </ul>\n' +
          '      <ul *ngIf="!item.url_destino && item.hijas.length" class="multilevel-menu" [items]="item.hijas" appMenu></ul>';
      }

    return itemstring;
}
}

