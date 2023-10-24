import { Component, OnInit, Inject } from '@angular/core';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { EventsService } from '@core/services/events/events.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { titles } from '@config/titles.constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '@core/models/filter.model';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';
import { tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

interface Pagination { page: number; pageSize: number; total: number; }

@Component({
  selector: 'app-events',
  templateUrl: '../../templates/events/events.component.html',
  styleUrls: ['../../templates/events/events.component.scss']
})
export class EventsComponent implements OnInit {

  public events = [];
  public months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  public page = 'PAG-42';
  public cmsData: any;

  private filtersSubject = new BehaviorSubject<Filter>({
    id: null,
    slug: null,
    pageSize: 12,
    searchText: '',
    internSearchText: '',
    userId: '',
    slugPromition: null,
    filters: {
      attributes: {},
      pageNumber: 1,
      productHighPrice: 0,
      productLowPrice: 0,
      sort: 1
    }
  });

  public pagination: Pagination = {
    page: this.currentFilters.filters.pageNumber,
    pageSize: this.currentFilters.pageSize,
    total: 0
  };

  constructor(
    public parametersService: ParametersService,
    public eventsService: EventsService,
    private adService: AdvertisementsService,
    public switchSpinnerService: SwitchSpinnerService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  get currentFilters(): Filter {
    return this.filtersSubject.value;
  }

  ngOnInit(): void {
    this.switchSpinnerService.on();
    this.adService.setTitle(titles.events);

    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
      this.adService.setMetaTags({title: data?.seo?.title ,
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords});
    });

    this.getEvents();
  }

  getEvents() {
    this.eventsService.getEvents(this.currentFilters)
    .pipe(tap(() => this.switchSpinnerService.off()))
    .subscribe((response: any) => {
      this.events = response.eventos;
      if(response.eventos.length > 0) this.pagination.total = response.totalItems;
    });
  }

  getMonth(month) {
    return this.months[month - 1];
  }

  handlePageChange(page: number): void {
    const { filters } = this.currentFilters;

    filters.pageNumber = page;

    this.filtersSubject.next({ ...this.currentFilters, filters });
    this.updateItemsByFilter().toPromise().then(() => {
      this.document.getElementById('headingThree')?.scrollIntoView();
    });

  } 

  updateItemsByFilter(filters?: any): Observable<any> {
    this.switchSpinnerService.on();
    return this.eventsService.getEvents(filters || this.currentFilters)
      .pipe(
        tap((response) => {
          this.events = response.eventos;
          if(response.eventos.length > 0) this.pagination.total = response.totalItems;
          this.pagination.pageSize = this.currentFilters.pageSize;
        }),
        tap(() => this.switchSpinnerService.off())
    );
  }

  updateListByPageSize(size: number){
    const filters = Object.assign({}, this.currentFilters);

    filters.pageSize = size;

    this.filtersSubject.next(filters);
    this.updateItemsByFilter().toPromise().then(() => {
      this.document.getElementById('headingThree')?.scrollIntoView();
    });
  }

}
