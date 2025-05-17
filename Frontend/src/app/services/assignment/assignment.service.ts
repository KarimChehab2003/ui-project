import { Injectable } from '@angular/core';
import { Assignment } from '../../models/assignment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private baseUrl = 'http://localhost:5090/api';
  public courseAssignments$ = new BehaviorSubject<Assignment[]>([]);

  constructor(private http: HttpClient) {
    this.getCourseAssignments();
  }

  getCourseAssignments() {
    this.http.get<any>(`${this.baseUrl}/assignments`).subscribe((response) => {
      // console.log(response.$values);
      this.courseAssignments$.next(response.$values);
    });
  }
}
