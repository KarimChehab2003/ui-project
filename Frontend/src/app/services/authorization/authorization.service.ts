import { Injectable } from '@angular/core';
import { Admin } from '../../models/admin';
import { Student } from '../../models/student';
import { Instructor } from '../../models/instructor';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
      modelBuilder = (data) => new Student(data.id, data.name, data.email, data.password, data.coursesIds);
    } else if (role === 'instructor') {
      endpoint = `${this.baseUrl}/Instructor`;
      modelBuilder = (data) => new Instructor(data.id, data.name, data.email, data.password, data.coursesIds);
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


  // SignUp Function
  signUp(role: string, name: string, email: string, password: string): Observable<Student | Instructor> {
    let endpoint = '';

    if (role === 'student') {
      endpoint = `${this.baseUrl}/Students`;
    } else if (role === 'instructor') {
      endpoint = `${this.baseUrl}/Instructor`;
    }

    const payload = {
      name: name,
      email: email,
      password: password
    };

    return this.http.post<Student | Instructor>(endpoint, payload);
  }
}
