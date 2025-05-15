import { Injectable } from '@angular/core';
import { Admin } from '../../models/admin';
import { Student } from '../../models/student';
import { Instructor } from '../../models/instructor';
import { HttpClient } from '@angular/common/http';
import { Observable, map , throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private baseUrl = 'http://localhost:5090/api';

  constructor(private http: HttpClient) {}

  // SignIn Function
  signIn(role: string, email: string, password: string): Observable<Student | Admin | Instructor> {
    let endpoint = '';
    let modelBuilder: (data: any) => Student | Admin | Instructor;

    if (role === 'admin') {
      endpoint = `${this.baseUrl}/Administrator`;
      modelBuilder = (data) => new Admin(data.id, data.name, data.email, data.password);
    } else if (role === 'student') {
      endpoint = `${this.baseUrl}/Students`;
      modelBuilder = (data) => new Student(data.id, data.name, data.email, data.password, data.courseIds.$values)
    } else if (role === 'instructor') {
      endpoint = `${this.baseUrl}/Instructor`;
      modelBuilder = (data) => new Instructor(data.id, data.name, data.email, data.password, data.courseIds.$values);
    }

    return this.http.get<any>(endpoint).pipe(
      map(response => {
        const users = response['$values'];
        const found = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);

        if (!found) {
          throw new Error('Invalid email or password');
        }

        return modelBuilder(found);
      })
    );
  }

  // Sign Up functions
  signUpInstructor(role: string, name: string, email: string, password: string): Observable<Instructor> {
    let endpoint = '';
    let checkEmailEndpoint = '';

    endpoint = `${this.baseUrl}/Instructor`;
    checkEmailEndpoint = `${this.baseUrl}/Instructor/check-email?email=${encodeURIComponent(email)}`;

    return this.http.get<boolean>(checkEmailEndpoint).pipe(
      switchMap((exists: boolean) => {
        if (exists) {
          return throwError(() => new Error('Email already taken'));
        } else {
          const payload = {
            name: name,
            email: email,
            password: password
          };
          return this.http.post<Instructor>(endpoint, payload);
        }
      })
    );
  }

  signUpStudent(role: string, name: string, email: string, password: string): Observable<Student> {
    let endpoint = '';

    endpoint = `${this.baseUrl}/studentsPending`;

    const payload = {
      name: name,
      email: email,
      password: password
    };
    return this.http.post<Instructor>(endpoint, payload);
  }

}
