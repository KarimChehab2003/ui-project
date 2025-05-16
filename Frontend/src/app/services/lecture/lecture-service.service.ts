import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lecture } from '../../models/lecture';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LectureServiceService {
  private baseUrl = 'http://localhost:5090/api';
  constructor(private http: HttpClient) {}

  getCourseLectures(courseId: number): Observable<Lecture[]> {
    return this.http.get<any>(`${this.baseUrl}/lectures`).pipe(
      map((response: any) => {
        const lectures: Lecture[] = response.$values || [];
        return lectures.filter(
          (lecture: Lecture) => lecture.courseId === courseId
        );
      })
    );
  }
}
