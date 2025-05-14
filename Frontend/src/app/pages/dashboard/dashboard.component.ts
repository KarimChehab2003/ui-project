import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StylishProfileViewerComponent } from './stylishProfileViewer/stylish-profile-viewer/stylish-profile-viewer.component';
import { DashboardOverviewComponent } from './dashboardOverview/dashboard-overview/dashboard-overview.component';
import { ActivityDashboardViewerComponent } from './ActivtiyDashBoardView/activity-dashboard-viewer/activity-dashboard-viewer.component';
import { Student } from '../../models/student';
import { BehaviorSubject } from 'rxjs';
import { Courses } from '../../models/courses';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../Services/courseService/courseservice';
import { Instructor } from '../../models/instructor';
import { InstructorService } from '../../Services/instructorService/instructor.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule , CommonModule // , StylishProfileViewerComponent,DashboardOverviewComponent
   // ,ActivityDashboardViewerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  loggedInUser:Student = new Student(0,'','','',[]);

enrolledCourses:Courses[]=[]

coursesInstructors:Instructor[] = [];
constructor(private courseService:CourseService , private instructorService:InstructorService){

let userData = localStorage.getItem('user');

this.loggedInUser = userData ? JSON.parse(userData) : null;

this.enrolledCourses = this.courseService.getStudentCourses(this.loggedInUser);

this.instructorService.getInstructors().subscribe(
  instructors=> {
   let filteredInstructors:Instructor[]=[];
for(let i=0 ; i<= this.enrolledCourses.length;i++)
{
 const instructorToAdd = instructors.find(instructor => instructor.id === this.enrolledCourses[i].instructorId);


 if (instructorToAdd) {
   filteredInstructors.push(instructorToAdd);
 }
}

this.coursesInstructors = filteredInstructors;
  }
);
}


findInstructor(course:Courses):Instructor | undefined{
return this.coursesInstructors.find(instructor=>instructor.coursesIds.includes(course.ID));
}


}
