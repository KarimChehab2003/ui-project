import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDashboardViewerComponent } from './activity-dashboard-viewer.component';

describe('ActivityDashboardViewerComponent', () => {
  let component: ActivityDashboardViewerComponent;
  let fixture: ComponentFixture<ActivityDashboardViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityDashboardViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityDashboardViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
