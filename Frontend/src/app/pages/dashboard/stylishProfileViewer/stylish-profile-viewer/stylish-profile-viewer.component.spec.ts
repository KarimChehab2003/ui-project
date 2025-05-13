import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylishProfileViewerComponent } from './stylish-profile-viewer.component';

describe('StylishProfileViewerComponent', () => {
  let component: StylishProfileViewerComponent;
  let fixture: ComponentFixture<StylishProfileViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylishProfileViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StylishProfileViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
