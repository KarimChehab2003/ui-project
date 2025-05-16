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
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public courseLecturesMap = new Map();

  public courseAssignmentMap = new Map();

  public courseQuizMap = new Map();

  public courseInstructorMap = new Map();

  public loggedInUser: Student | null = null;

  public studentCourses: BehaviorSubject<Courses[]> | null = null;

  constructor(
    private studentCourseService: StudentCourseService,
    private studentService: StudentService,
    private quizService: QuizserviceService,
    private lectureService: LectureServiceService,
    private assignmentService: AssignmentService
  ) {
    this.loadUser(); // tmm
    // this.studentCourseService.loadUser(); // why are you loading the user twice ? You can delete this line

    this.studentCourses = new BehaviorSubject<Courses[]>([]); // Reset it everytime the page reloads

    this.studentCourseService.enrolledCourses.subscribe((courses) => {
      console.log('This is courses: ', courses);
      let foundcourses: Courses[] = courses.map((courseItem) => {
        console.log('This is a single course item: ', courseItem);
        let enrolledCourse: Courses = new Courses(
          courseItem.id,
          courseItem.title, // Its not name, its title
          courseItem.description,
          courseItem.durationInHours,
          courseItem.level,
          courseItem.sectionCount,
          courseItem.lectureCount,
          courseItem.lectureIDS.$values, // You accessed the wrong item, its called lectureIDS, not lecturesId
          courseItem.assignmentIds?.$values, // This was an object. You were setting an array to an object, making it undefined. You needed to access the array inside the object
          courseItem.quizIds?.$values, // You accessed the wrong item, its called quizIds, not quizzesId
          courseItem.instructorId,
          courseItem.studentIds.$values, // There is no key named enrolledStudents, use studentIds instead
          courseItem.assignments, // Warning: There is nothing named assignments in the returned object
          courseItem.quizzes, // Same thing as assignments
          courseItem.lectures // Same thing as assignments
        );

        return enrolledCourse;
      });
      console.log('This is found courses array: ', foundcourses);

      this.studentCourses?.next(foundcourses);

      foundcourses.forEach((course) => {
        this.courseLecturesMap.set(course.id, this.getCourseLectures(course)); // lectures
        this.courseAssignmentMap.set(
          course.id,
          this.getCourseAssignments(course)
        ); // assignments
        this.courseQuizMap.set(course.id, this.getCourseQuizzes(course)); // quizzes
        this.courseInstructorMap.set(course.id, this.getInstructor(course)); // instructors
      });
    });

    this.studentCourseService.fetchCourses();

    // Redundant subscriptions

    // //fetching lectures
    // this.studentCourses?.subscribe((coursearray) => {
    //   coursearray.forEach((course) =>
    //     this.courseLecturesMap.set(course.id, this.getCourseLectures(course))
    //   );
    // });

    // //fetching assignments
    // this.studentCourses?.subscribe((coursearray) => {
    //   coursearray.forEach((course) =>
    //     this.courseAssignmentMap.set(
    //       course.id,
    //       this.getCourseAssignments(course)
    //     )
    //   );
    // });

    // // fetching quizzes

    // this.studentCourses?.subscribe((coursearray) => {
    //   coursearray.forEach((course) =>
    //     this.courseQuizMap.set(course.id, this.getCourseQuizzes(course))
    //   );
    // });

    // // fetching instructors

    // this.studentCourses?.subscribe((coursearray) => {
    //   coursearray.forEach((course) =>
    //     this.courseQuizMap.set(course.id, this.getInstructor(course))
    //   );
    // });
  }

  loadUser() {
    const retrievedUser = localStorage.getItem('user');
    this.loggedInUser = retrievedUser
      ? (JSON.parse(retrievedUser) as Student)
      : null;
    console.log(this.loggedInUser);
  }

  getInstructor(course: Courses): Instructor | null {
    return this.studentService.getInstructor(course.instructorId);
  }

  getCourseLectures(course: Courses): Lecture[] {
    return this.lectureService.getCourseLectures(course.id);
  }

  getCourseQuizzes(course: Courses): Quiz[] {
    return this.quizService.getCourseQuizzes(course.id);
  }

  getCourseAssignments(course: Courses): Assignment[] {
    return this.assignmentService.getcourseAssignment(course.id);
  }
}
