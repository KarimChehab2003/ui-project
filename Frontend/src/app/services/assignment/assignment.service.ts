import { Injectable } from '@angular/core';
import { Assignment } from '../../models/assignment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
 private baseUrl = 'http://localhost:5090/api';
  constructor(private http:HttpClient) { }

getcourseAssignment(courseId:number):Assignment[]{

let Allassigments = this.http.get<Assignment[]>(`${this.baseUrl}/assignments`);

let courseAssigments:Assignment[] = [];

Allassigments.subscribe(
assignments=>{
courseAssigments = assignments.filter(assignment=>assignment.courseId===courseId);
}

);
return courseAssigments;
}


}
