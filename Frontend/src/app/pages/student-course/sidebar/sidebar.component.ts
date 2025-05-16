import { Component } from '@angular/core';
import { Student } from '../../../models/student';
import { StudentCourseService } from '../../../services/student-course/student-course.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  user: Student | null = null;
  courses: any[] = [];

  constructor(private studentCourseService: StudentCourseService) {
    this.user = this.studentCourseService.getUser();
    console.log(this.user);
    this.studentCourseService.enrolledCourses.subscribe(
      (courses) => (this.courses = courses)
    );
    console.log('THIS IS COURSES :', this.courses);
  }

  handleSelect(course: any) {
    this.studentCourseService.selectedCourse.next(course);
  }
}
