import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { Courses } from '../../models/courses';

@Injectable({
  providedIn: 'root'
})

export class InstructorService {

  private baseUrl = 'http://localhost:5090/api';

  constructor(private http: HttpClient) {}


  getInstructorCourses(instructorId: number): Observable<Courses[]> {
    return this.http.get<any>(`${this.baseUrl}/Instructor/${instructorId}`).pipe(
      switchMap(instructor => {
        const courseIds = instructor.courseIds?.$values || [];

        const courseRequests = courseIds.map((courseId: number) =>
          this.http.get<any>(`${this.baseUrl}/Course/${courseId}`).pipe(
            map(course => new Courses(
              course.title,
              course.description,
              course.durationInHours,
              course.level,
              course.sectionCount,
              course.lectureCount,
              course.lectureIDS?.$values || [],
              course.assignmentIds?.$values || [],
              course.quizIds?.$values || [],
              course.instructorId,
              course.studentIds?.$values || []
            ))
          )
        );

        return forkJoin<Courses[]>(courseRequests);
      })
    );
  }

}
