import { Injectable } from '@angular/core';
import { Instructor } from '../../models/instructor';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'http://localhost:5090/api';

  constructor(private http: HttpClient) {}

  getInstructor(instructorId:number):Instructor | null{
  
      let instructorObservable = this.http.get<any>(`${this.baseUrl}/Instructor/${instructorId}`);
  
      let courseInstructor: Instructor|null = null;
  
      instructorObservable.subscribe(
  
      instructor=>{
        courseInstructor = instructor;
      }
      );
  
      return courseInstructor;
    }
}
