import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StylishProfileViewerComponent } from './stylishProfileViewer/stylish-profile-viewer/stylish-profile-viewer.component';
import { DashboardOverviewComponent } from './dashboardOverview/dashboard-overview/dashboard-overview.component';
import { ActivityDashboardViewerComponent } from './ActivtiyDashBoardView/activity-dashboard-viewer/activity-dashboard-viewer.component';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student';
import { StudentCourseService } from '../../services/student-course/student-course.service';
import { Courses } from '../../models/courses';
import { BehaviorSubject } from 'rxjs';
import { StudentService } from '../../services/student/student.service';
import { Instructor } from '../../models/instructor';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule ,CommonModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

public loggedInUser: Student | null = null;

public studentCourses:BehaviorSubject<Courses[]>|null = null;

constructor(private studentCourseService:StudentCourseService , private studentService:StudentService){
  
this.loadUser();

this.studentCourseService.loadUser();

this.studentCourseService.enrolledCourses.subscribe(

courses =>{this.studentCourses?.next(courses)}

);

this.studentCourseService.fetchCourses();
}


  loadUser(){
    const retrievedUser = localStorage.getItem("user")
    this.loggedInUser = retrievedUser ? JSON.parse(retrievedUser) as Student : null;
  }

getInstructor(course:Courses):Instructor|null{

return this.studentService.getInstructor(course.instructorId);

}


}
