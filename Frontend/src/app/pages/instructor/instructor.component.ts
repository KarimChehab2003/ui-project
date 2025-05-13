import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})

export class InstructorComponent implements OnInit {

  constructor(private router: Router) {}

  loggedInInstructor: string = '';

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.loggedInInstructor = user.name;
    }
  }

  goToMyCourses(){
    this.router.navigate(['/instructor-course']);
  }

  logout(){
    localStorage.setItem('user', "");
    localStorage.setItem('role', "");
    this.router.navigate(['/']);
  }
}
