import { Injectable } from '@angular/core';
import { Admin } from '../../models/admin';
import { Student } from '../../models/student';
import { Instructor } from '../../models/instructor';
import { Courses } from '../../models/courses';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:5090/api';

  constructor(private http: HttpClient) {}

  addNewUser(
    userType: 'admin' | 'student' | 'instructor',
    userData: { name: string; email: string; password: string }
  ): Observable<any> {
    let endpoint: string;
    if (userType === 'student') {
      endpoint = `${this.baseUrl}/${userType}s`;
    } else {
      endpoint = `${this.baseUrl}/${userType}`;
    }
    return this.http.post(endpoint, userData);
  }

  updateUser(
    userType: 'admin' | 'student' | 'instructor',
    userId: number,
    userData: { name: string; email: string; password?: string }
  ): Observable<any> {
    let endpoint: string;
    if (userType === 'student') {
      endpoint = `${this.baseUrl}/${userType}s/${userId}`;
    } else {
      endpoint = `${this.baseUrl}/${userType}/${userId}`;
    }
    return this.http.put(endpoint, userData);
  }

  deleteUser(
    userType: 'admin' | 'student' | 'instructor',
    userId: number
  ): Observable<any> {
    let endpoint: string;
    if (userType === 'student') {
      endpoint = `${this.baseUrl}/${userType}s/${userId}`;
    } else {
      endpoint = `${this.baseUrl}/${userType}/${userId}`;
    }
    return this.http.delete(endpoint);
  }

  enrollStudentInCourse(studentId: number, courseId: string): Observable<any> {
    const endpoint = `${this.baseUrl}/students/${studentId}/enroll/${courseId}`;
    return this.http.post(endpoint, {});
  }

  getStudents(): Observable<any> {
    const endpoint = `${this.baseUrl}/students`;
    return this.http.get(endpoint);
  }

  getInstructors(): Observable<any> {
    const endpoint = `${this.baseUrl}/Instructor`;
    return this.http.get(endpoint);
  }

  addCourse(courseData: {
    title: string;
    description: string;
    durationInHours: number;
    level: string;
    sectionCount: number;
    lectureCount: number;
    instructorId: number;
    studentIds: number[];
    assignmentIds: number[];
    lectureIDS: number[];
    quizIds: number[];
  }): Observable<any> {
    const endpoint = `${this.baseUrl}/Course`;
    return this.http.post(endpoint, courseData);
  }

  updateCourse(
    courseId: number,
    courseData: {
      title: string;
      description: string;
      durationInHours: number;
      level: string;
      sectionCount: number;
      lectureCount: number;
      instructorId: number;
      studentIds: number[];
      assignmentIds: number[];
      lectureIDs: number[];
      quizIds: number[];
    }
  ): Observable<any> {
    const endpoint = `${this.baseUrl}/Course/${courseId}`;
    return this.http.put(endpoint, courseData);
  }

  deleteCourse(courseId: number): Observable<any> {
    const endpoint = `${this.baseUrl}/Course/${courseId}`;
    return this.http.delete(endpoint);
  }

  assignStudentToCourse(courseId: number, studentId: number): Observable<any> {
    const endpoint = `${this.baseUrl}/Course/${courseId}/assign-student/${studentId}`;
    return this.http.post(endpoint, {});
  }

  getCourses(): Observable<any> {
    const endpoint = `${this.baseUrl}/Course`;
    return this.http.get(endpoint);
  }

  getPendingStudents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/studentsPending`);
  }

  approveStudent(student: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/students`, student);
  }

  removePendingStudent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/studentsPending/${id}`);
  }
}
