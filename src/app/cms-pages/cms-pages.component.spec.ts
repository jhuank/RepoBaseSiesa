import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMSPagesComponent } from './cms-pages.component';

describe('CMSPagesComponent', () => {
  let component: CMSPagesComponent;
  let fixture: ComponentFixture<CMSPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMSPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
