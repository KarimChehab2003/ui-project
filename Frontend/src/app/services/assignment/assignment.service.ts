import { Injectable } from '@angular/core';
import { Assignment } from '../../models/assignment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private baseUrl = 'http://localhost:5090/api';
  constructor(private http: HttpClient) {}

  getCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.http.get<any>(`${this.baseUrl}/assignments`).pipe(
      map((res) => {
        const assignments: Assignment[] = res.$values ?? [];
        return assignments.filter((a) => a.courseId === courseId);
      })
    );
  }
}
