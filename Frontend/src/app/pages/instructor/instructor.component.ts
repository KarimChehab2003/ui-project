import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorService } from '../../services/instructor/instructor.service';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})

export class InstructorComponent implements OnInit {

  constructor(private router: Router , private instructorService : InstructorService) {}

  loggedInInstructor: string = '';
  loggedInInstructorId: number = 0;

  CourseName : string = '';
  CourseDesc : string = '';
  CourseDuration : string = '';
  CourseLevel : string = '';
  CourseLecCount : string = '';
  CourseSecCount : string = '';

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.loggedInInstructor = user.name;
      this.loggedInInstructorId = user.id;
    }
  }

  addCourse(){

    if (
      this.CourseName == "" ||
      this.CourseDesc == "" ||
      this.CourseDuration == "" ||
      this.CourseLevel == "" ||
      this.CourseLecCount == "" ||
      this.CourseSecCount == ""
    ) {
      alert("Please fill in all course fields before submitting.");
      return;
    }

    this.instructorService.addCourse(this.loggedInInstructorId, this.CourseName , this.CourseDesc , this.CourseDuration , this.CourseLevel , this.CourseLecCount, this.CourseSecCount)
    .subscribe(response => {
      this.CourseName = '';
      this.CourseDesc = '';
      this.CourseDuration = '';
      this.CourseLevel = '';
      this.CourseLecCount = '';
      this.CourseSecCount = '';
      alert("Course has been added successfully!");
    });
    
  }

  clear(){
    this.CourseName = '';
    this.CourseDesc = '';
    this.CourseDuration = '';
    this.CourseLevel = '';
    this.CourseLecCount = '';
    this.CourseSecCount = '';
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
