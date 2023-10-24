import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ProductService } from '@core/services/product/product.service';
import { Product } from '@core/models/product.model';
import { DOCUMENT } from '@angular/common';
import { ShareDataService } from '@core/services/share-data/share-data.service';

@Component({
    selector: 'app-search',
    templateUrl: '../../../../templates/shared/components/search/search.component.html',
    styleUrls: ['../../../../templates/shared/components/search/search.component.scss'],
})
export class SearchComponent implements OnInit {
    @Input() public placeholder: string;
    @ViewChild('inputSearchMobile') inputMovile: ElementRef;
    @ViewChild('inputSearch') inputDesktop: ElementRef;
    public searchQuery = new Subject<string>();
    public showResults = false;
    public results: Product[];

    constructor(
        private productService: ProductService,
        private router: Router,
        @Inject(DOCUMENT) private document: Document,
        private shareDataService: ShareDataService
    ) {}

    ngOnInit(): void {
        Object.values(this.document.getElementsByClassName('btn-search')).forEach(element => {
            element.addEventListener('click', () => {
                this.focusToInputs();
            });
        });

        this.shareDataService.focusOnInput.subscribe(() => {
            this.focusToInputs();
        });

        this.searchQuery.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((query: string) => this.productService.search(query))
        ).subscribe((products) => {
            this.results = products;
        });
    }

    search(query: string): void {
        if (query.length > 2) {
            this.showResults = true;
            this.searchQuery.next(query);
        } else {
            this.showResults = false;
        }
    }

    select(product: Product) {
        this.showResults = false;
        this.router.navigate([product.category.slug, product.slug]);
    }

    enter(query: string) {
        if (query.length > 2) {
            this.showResults = false;
            this.router.navigate(['/', query, 'search']);
        }
    }

    focusToInputs(): void {
        this.inputDesktop.nativeElement.focus(); 
        this.inputMovile.nativeElement.focus();
    }
}
