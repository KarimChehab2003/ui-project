import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../../models/student';


@Injectable({
  providedIn: 'root'
})
export class StudentCourseService {

  enrolledCourses = new BehaviorSubject<any[]>([]);
  private user: Student | null = null;
  selectedCourse = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.loadUser();
    this.fetchCourses();
    // console.log(this.enrolledCourses);
    // console.log(this.user);
  }

  loadUser(){
    const retrievedUser = localStorage.getItem("user")
    this.user = retrievedUser ? JSON.parse(retrievedUser) as Student : null;
  }

  getUser(){
    return this.user;
   }
  
  fetchCourses(){
    let courses : any[] = []
    this.user?.coursesIds.forEach((id)=>{
      this.http.get<any>(`http://localhost:5090/api/Course/${id}`).subscribe((response)=>courses.push(response))
    })
    this.enrolledCourses.next(courses);
  }
}
