import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lecture } from '../../models/lecture';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LectureServiceService {
 private baseUrl = 'http://localhost:5090/api';
  constructor(private http:HttpClient) { }

getCourseLectures(courseId:number):Lecture[]{

let courseLectures:Lecture[] = [];

let AllLectures:Observable<Lecture[]> = this.http.get<Lecture[]>(`${this.baseUrl}/Lecture`);


AllLectures.subscribe(

  Lectures=>{
    courseLectures = Lectures.filter(lecture=>lecture.courseId===courseId);
  }
);
return courseLectures;
}

}
