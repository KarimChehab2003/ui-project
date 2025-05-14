import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../services/authorization/authorization.service';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student';
import { Instructor } from '../../models/instructor';

@Component({
  selector: 'app-signup',
  imports: [ FormsModule ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {
  name = "";
  role = "";
  email = "";
  password = "";
  user: Instructor | Student | null = null;

  constructor(private router: Router , private authorizationService : AuthorizationService) {}

  signUpPressed(){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.role || !this.name || !this.email || !this.password) {
      return alert('SignUp failed: Please enter all required fields.');
    }

    if (!emailRegex.test(this.email)) {
      return alert('SignUp failed: Please enter a valid email address.');
    }

    if (this.password.length < 6) {
      return alert('SignUp failed: Password must be at least 6 characters long.');
    }

    this.authorizationService.signUp(this.role, this.name , this.email, this.password).subscribe({
      next: (user) => {
        this.user = user;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', this.role);

        if (this.role === 'student') {
          this.router.navigate(['/dashboard']);
        } else if (this.role === 'instructor') {
          this.router.navigate(['/instructor']);
        }
      },
      error: (err) => {
        alert('SignUp failed: ' + err.message);
      }
    });
  }

  goToSignIn(){
    this.router.navigate(['/']);
  }
}
