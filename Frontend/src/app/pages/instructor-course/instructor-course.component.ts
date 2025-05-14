import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Courses } from '../../models/courses';
import { Router } from '@angular/router';
import { InstructorService } from '../../services/instructor/instructor.service';

@Component({
  selector: 'app-instructor-course',
  templateUrl: './instructor-course.component.html',
  styleUrl: './instructor-course.component.css',
  standalone: true,
  imports: [CommonModule , FormsModule],
})

export class InstructorCourseComponent implements OnInit {

  constructor(private router: Router , private instructorService : InstructorService) {}

  loggedInInstructor: string = '';
  coursesExpanded = true;
  selectedCourse: Courses | null = null;
  instructorCourses : Courses[] = [];

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.loggedInInstructor = user.name;

      this.instructorService.getInstructorCourses(user.id).subscribe(
      (courses: Courses[]) => {
        this.instructorCourses = courses;

        if (this.instructorCourses.length > 0) {
          this.selectedCourse = this.instructorCourses[0];
        }
      }
    );
    }
  }

  toggleCourses() {
    this.coursesExpanded = !this.coursesExpanded;
  }

  selectCourse(course: Courses) {
    this.selectedCourse = course;
  }

  goToInstructorPage(){
    this.router.navigate(['/instructor']);
  }

  logout(){
    localStorage.setItem('user', "");
    localStorage.setItem('role', "");
    this.router.navigate(['/']);
  }
}
