import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Student } from '../../models/student';
import { Admin } from '../../models/admin';
import { Instructor } from '../../models/instructor';
import { AuthorizationService } from '../../services/authorization/authorization.service';

@Component({
  selector: 'app-signin',
  imports: [ FormsModule ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  constructor(private router: Router , private authorizationService : AuthorizationService) {}

  role = "";
  email = "";
  password = "";
  user: Instructor | Admin | Student | null = null;

  signInPressed(){
    this.authorizationService.signIn(this.role, this.email, this.password).subscribe({
      next: (user) => {
        this.user = user;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', this.role);

        if (this.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (this.role === 'student') {
          this.router.navigate(['/dashboard']);
        } else if (this.role === 'instructor') {
          this.router.navigate(['/instructor']);
        }
      },
      error: (err) => {
        alert('Login failed: ' + err.message);
      }
    });

  }

  goToSignUp(){
    this.router.navigate(['/register']);
  }
}
