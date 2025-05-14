import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Courses } from '../../models/courses';
import { Student } from '../../models/student';
@Injectable({
  providedIn: 'root'
})
export class CourseService {

private baseUrl:string = "http://localhost:5090/api";

private AllCourses:Observable<Courses[]>| null = null;
  constructor(private http :HttpClient) { }

  
getStudentCourses (currentStudent:Student):Courses[]{

this.AllCourses= this.http.get<Courses[]>(this.baseUrl+'/Courses');

let enrolledCourses:Courses[]=[];

 this.AllCourses.subscribe(

listOfCourses=>{

let studentSpecificCourses:Courses[] = listOfCourses.filter(Course => currentStudent.coursesIds.includes(Course.ID));


enrolledCourses= studentSpecificCourses;
}

);

return enrolledCourses;
}

}
