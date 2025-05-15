import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../../models/quiz';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QuizserviceService {

 private baseUrl = 'http://localhost:5090/api';


  constructor(private http:HttpClient) { }



getCourseQuizzes(courseId:number):Quiz[]{

  let courseQuizzes:Quiz[] = [];

let AllQuizzes:Observable<Quiz[]> = this.http.get<Quiz[]>(`${this.baseUrl}/Quiz`) ;

AllQuizzes.subscribe(

quizzes=>{
  courseQuizzes = quizzes.filter(quiz=>quiz.courseId === courseId);
}


);

return courseQuizzes;

}

}
