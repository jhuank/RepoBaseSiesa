import { OnInit, Component, Input } from '@angular/core';
import { BlogService } from '../../../services/blog/blog.service';
import { Router } from '@angular/router';
import { AdvertisementsService } from '../../services/advertisements/advertisements.service';

@Component({
    selector: 'app-aside-blog',
    templateUrl: '../../../../templates/shared/components/aside-blog/aside-blog.component.html',
    styleUrls: ['../../../../templates/shared/components/aside-blog/aside-blog.component.scss']
  })
  export class AsideBlogComponent implements OnInit {

    // tslint:disable-next-line:no-input-rename
    @Input('cmsData')
    public cmsData: any;

    // tslint:disable-next-line:no-input-rename
    @Input('cmsType')
    public cmsType: any;

    // tslint:disable-next-line:no-input-rename
    @Input('cmsPosition')
    public cmsPosition: any;

    public contentPanel: any;
    p = 1;
    collection: any;

    constructor(
        private blogService: BlogService,
        private router: Router,
        private adService: AdvertisementsService) {}

    ngOnInit() {
        this.getContenPanel();
    }

    getContenPanel() {
        this.blogService.contentBlogPanel()
            .subscribe((panelResponse: any) => {
                return this.contentPanel = panelResponse;
            });
    }

    searchBlog( termino: string) {
        if ( termino.length < 1 ) {
            return;
        }

        this.router.navigate(['/blog/search', termino]);
    }
  }
