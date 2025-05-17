import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lecture } from '../../models/lecture';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { Assignment } from '../../models/assignment';
@Injectable({
  providedIn: 'root',
})
export class LectureServiceService {
  private baseUrl = 'http://localhost:5090/api';
  public courseLectures$ = new BehaviorSubject<Assignment[]>([]);

  constructor(private http: HttpClient) {
    this.getCourseLectures();
  }

  getCourseLectures() {
    this.http.get<any>(`${this.baseUrl}/lectures`).subscribe((response) => {
      // console.log(response.$values);
      this.courseLectures$.next(response.$values);
    });
  }
}
