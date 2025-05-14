import { TestBed } from '@angular/core/testing';

import { StudentCourseService } from './student-course.service';

describe('StudentCourseService', () => {
  let service: StudentCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
