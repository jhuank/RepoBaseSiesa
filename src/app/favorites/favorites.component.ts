import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ParametersService } from '@core/services/parameters/parameters.service';
import { FavoritesService } from '@core/services/favorites/favorites.service';
import { AdvertisementsService } from '../shared/services/advertisements/advertisements.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '@core/models/filter.model';
import { SwitchSpinnerService } from '@core/services/switch-spinner/switch-spinner.service';
import { tap } from 'rxjs/operators';
import { titles } from '@config/titles.constants';
import { DOCUMENT } from '@angular/common';

interface Pagination { page: number; pageSize: number; total: number; }

@Component({
  selector: 'app-favorites',
  templateUrl: '../../templates/favorites/favorites.component.html',
  styleUrls: ['../../templates/favorites/favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  @ViewChild('headingThree') headingThreeRef: ElementRef;
  private showLocalSpinnerSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public page = "PAG-42";
  public cmsData: any;
  public favorites: any;
  public favoritesList: any;
  public user:any = null;

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
    public favoritesService: FavoritesService,
    private adService: AdvertisementsService,
    public switchSpinnerService: SwitchSpinnerService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get currentFilters(): Filter {
    return this.filtersSubject.value;
  }

  ngOnInit(): void {
    this.switchSpinnerService.on();
    this.adService.setTitle(titles.favorites);
    this.adService.getAdvertisements(this.page).subscribe((data: any) => {
      this.cmsData = data;
      this.adService.setMetaTags({title: data?.seo?.title ,
        meta_description: data?.seo?.meta_description,
        image: data?.image,
        og_title: data?.seo?.og_title,
        og_description: data?.seo?.og_description,
        keywords: data?.seo?.keywords});
    });

    if (localStorage.getItem('currentUser') !== null) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
      this.getFavorites();
    }


  }

  getFavorites(){
    this.favoritesService.getFavorites(this.user.userId, this.currentFilters)
      .pipe(tap(() => this.switchSpinnerService.off()))
      .subscribe((response:any)=>{

        this.favoritesList = response;
        this.favorites = response;
        if(response.length > 0) this.pagination.total = response[0].totalPages;
      
      });
  }

  updateListByText(searchText:string){
    this.favorites = this.favoritesList.filter(
      value => (value.reference.indexOf(searchText.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1
              || value.name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(searchText.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1)
    );
  }

  updateListByPageSize(size: number){
    const filters = Object.assign({}, this.currentFilters);

    filters.pageSize = size;

    this.filtersSubject.next(filters);
    this.headingThreeRef.nativeElement.scrollIntoView();
    this.updateItemsByFilter().toPromise();
  }

  updateListBySort(){

  }

  // Pagination
  handlePageChange(page: number): void {
    const { filters } = this.currentFilters;

    filters.pageNumber = page;

    this.filtersSubject.next({ ...this.currentFilters, filters });
    this.headingThreeRef.nativeElement.scrollIntoView();
    this.updateItemsByFilter().toPromise();
  }

  
  // Actualiza los favoritos
  updateItemsByFilter(filters?: any): Observable<any> {
    this.showLocalSpinnerSubject.next(true);
    return this.favoritesService.getFavorites(this.user.userId, filters || this.currentFilters)
      .pipe(
        tap((response) => {

        this.favoritesList = response;
        this.favorites = response;
        if(response.length > 0) this.pagination.total = response[0].totalPages;
        this.pagination.pageSize = this.currentFilters.pageSize;
        }),
        tap(() => this.showLocalSpinnerSubject.next(false))
    );
  }

  get localSpinner(): boolean {
    return this.showLocalSpinnerSubject.value;
  }
}
