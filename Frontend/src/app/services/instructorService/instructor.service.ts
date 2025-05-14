import { Injectable } from '@angular/core';
import { Instructor } from '../../models/instructor';
import { HttpClient } from '@angular/common/http';
import { Courses } from '../../models/courses';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
private baseUrl:string="http://localhost:5090/api";
  constructor(private http:HttpClient) { }

getInstructors():Observable<Instructor[]>{
  return this.http.get<Instructor[]>(`${this.baseUrl}/instructor`);

}


}
