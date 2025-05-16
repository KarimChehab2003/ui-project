import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../../models/quiz';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class QuizserviceService {
  private baseUrl = 'http://localhost:5090/api';

  constructor(private http: HttpClient) {}

  getCourseQuizzes(courseId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.baseUrl}/Quiz`).pipe(
      map((response: any) => {
        const quizzes = response.$values;
        return quizzes.filter((quiz: any) => quiz.courseId === courseId);
      })
    );
  }
}
