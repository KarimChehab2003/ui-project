import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../../models/quiz';
import { Observable, map, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class QuizserviceService {
  private baseUrl = 'http://localhost:5090/api';
  public courseQuizzes$ = new BehaviorSubject<Quiz[]>([]);

  constructor(private http: HttpClient) {
    this.getCourseQuizzes();
  }

  getCourseQuizzes() {
    this.http.get<any>(`${this.baseUrl}/Quiz`).subscribe((response) => {
      // console.log(response.$values);
      this.courseQuizzes$.next(response.$values);
    });
  }
}
