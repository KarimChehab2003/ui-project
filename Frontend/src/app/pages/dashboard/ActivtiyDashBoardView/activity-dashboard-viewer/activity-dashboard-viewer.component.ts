import { Component } from '@angular/core';
import { Student } from '../../../../models/student';
import { Assignment } from '../../../../models/assignment';
import { Lecture } from '../../../../models/lecture';
import { Quiz } from '../../../../models/quiz';
import { StudentCourseService } from '../../../../services/student-course/student-course.service';
import { StudentService } from '../../../../services/student/student.service';
import { BehaviorSubject } from 'rxjs';
import { QuizserviceService } from '../../../../services/quiz/quizservice.service';
import { LectureServiceService } from '../../../../services/lecture/lecture-service.service';
import { AssignmentService } from '../../../../services/assignment/assignment.service';
import { Courses } from '../../../../models/courses';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-activity-dashboard-viewer',
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-dashboard-viewer.component.html',
  styleUrl: './activity-dashboard-viewer.component.css',
})
export class ActivityDashboardViewerComponent {
  public loggedInUser: Student | null = null;
  assignments: Assignment[] = [];
  lectures: Lecture[] = [];
  quizzes: Quiz[] = [];
  courses: Courses[] = [];
  constructor(
    private studentCourseService: StudentCourseService,
    private studentService: StudentService,
    private quizService: QuizserviceService,
    private lectureService: LectureServiceService,
    private assignmentService: AssignmentService
  ) {
    this.loadUser(); // tmm

    this.assignmentService.courseAssignments$.subscribe((data) => {
      this.assignments = [];
      this.assignments = data.filter((assignment) =>
        this.loggedInUser?.coursesIds.includes(assignment.courseId)
      );
      // console.log(this.assignments);
    });

    this.lectureService.courseLectures$.subscribe((data) => {
      this.lectures = [];
      console.log(data);
      this.lectures = data.filter((lecture) =>
        this.loggedInUser?.coursesIds.includes(lecture.courseId)
      );
      // console.log('lectures array:', this.lectures);
    });

    this.quizService.courseQuizzes$.subscribe((data) => {
      this.quizzes = [];
      this.quizzes = data.filter((lecture) =>
        this.loggedInUser?.coursesIds.includes(lecture.courseId)
      );
      console.log('quiz array:', this.quizzes);
    });

    this.studentCourseService.enrolledCourses.subscribe((data) => {
      this.courses = data;
      console.log('This is enrolled courses:', this.courses);
    });
  }

  loadUser() {
    const retrievedUser = localStorage.getItem('user');
    this.loggedInUser = retrievedUser
      ? (JSON.parse(retrievedUser) as Student)
      : null;
    // console.log(this.loggedInUser);
  }
}
