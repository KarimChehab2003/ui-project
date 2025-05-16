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
import { QuizserviceService } from '../../services/quiz/quizservice.service';
import { LectureServiceService } from '../../services/lecture/lecture-service.service';
import { Lecture } from '../../models/lecture';
import { Quiz } from '../../models/quiz';
import { AssignmentService } from '../../services/assignment/assignment.service';
import { Assignment } from '../../models/assignment';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule ,CommonModule,FormsModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {


  public courseLecturesMap = new Map();

  public courseAssignmentMap = new Map();

  public courseQuizMap = new Map();

  public courseInstructorMap= new Map();

public loggedInUser: Student | null = null;

public studentCourses:BehaviorSubject<Courses[]>|null = null;



constructor(private studentCourseService:StudentCourseService , private studentService:StudentService
  ,private quizService:QuizserviceService ,private lectureService:LectureServiceService,
  private assignmentService:AssignmentService
){
  
this.loggedInUser = this.studentCourseService.getUser();

this.studentCourseService.enrolledCourses.subscribe(

courses =>{
let foundcourses:Courses[] = courses.map(courseItem => {
  


let enrolledCourse:Courses = new Courses(
  courseItem.id,
  courseItem.name,
  courseItem.description,
  courseItem.durationInHours,
  courseItem.level,
  courseItem.sectionCount,
  courseItem.lectureCount,
  courseItem.lecturesId,
  courseItem.assignmentIds,
  courseItem.quizzesId,
  courseItem.instructorId,
  courseItem.enrolledStudents,
  courseItem.assignments,
  courseItem.quizzes,
  courseItem.lectures
); 
console.log(enrolledCourse)
return enrolledCourse;
});

this.studentCourses.next(foundcourses);
}



);




//fetching lectures,assignments and quizzes
this.studentCourses?.subscribe(
coursearray=> {
  coursearray.forEach(course=> this.courseLecturesMap.set(course.id,this.getCourseLectures(course)));
coursearray.forEach(course=> this.courseAssignmentMap.set(course.id,this.getCourseAssignments(course)));
coursearray.forEach(course=>this.courseInstructorMap.set(course.id,this.getInstructor(course)));
coursearray.forEach(course=> this.courseQuizMap.set(course.id,this.getCourseQuizzes(course)));



}

);


console.log(this.studentCourses);
console.log(this.courseLecturesMap);
console.log(this.courseInstructorMap);
console.log(this.courseAssignmentMap);
console.log(this.courseQuizMap);
}




getInstructor(course:Courses):Instructor|null{

return this.studentService.getInstructor(course.instructorId);

}


getCourseLectures(course:Courses):Lecture[]{
return this.lectureService.getCourseLectures(course.id);
}

getCourseQuizzes(course:Courses):Quiz[]{
  return this.quizService.getCourseQuizzes(course.id);
}

getCourseAssignments(course:Courses):Assignment[]{
  return this.assignmentService.getcourseAssignment(course.id);
}
}
