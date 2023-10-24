import {Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-advertisements',
  templateUrl: '../../../../templates/shared/components/advertisements/advertisements.component.html',
  styleUrls: ['../../../../templates/shared/components/advertisements/advertisements.component.scss'],
  providers: [NgbCarouselConfig]
})
export class AdvertisementsComponent implements OnInit {
  @Input() public positions: number;
  @Input() public typeContent: 'espacios' | 'carrusel';
  @Input() public contentData: any;
  @Input() public espacios: any;
  // images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);
  showNavigationArrows = false;
  showNavigationIndicators = false;
  images = [1055, 194, 368, 932, 29, 829].map((n) => `https://picsum.photos/id/${n}/900/500`);

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;

  // @ts-ignore
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent) {
    // if (this.unpauseOnArrow && slideEvent.paused &&
    //   (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
    //   this.togglePaused();
    // }
    // if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
    //   this.togglePaused();
    // }
  }

  constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {

  }

  scrollLeft(content: any) {
    const tenPercent = (content.scrollWidth * 0.2);
    const left = (content.scrollLeft - tenPercent);

    content.scroll({ left, behavior: 'smooth' });
  }


  scrollRight(content: any) {
    const tenPercent = (content.scrollWidth * 0.2);
    const left = (content.scrollLeft + tenPercent);

    content.scroll({ left, behavior: 'smooth' });

  }

}
