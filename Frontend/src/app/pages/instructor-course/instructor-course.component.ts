import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Courses } from '../../models/courses';
import { Router } from '@angular/router';
import { Lecture } from '../../models/lecture';
import { Assignment } from '../../models/assignment';
import { Quiz } from '../../models/quiz';
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
  instructorCourses : Courses[] = [];

  coursesExpanded = true;
  selectedCourse: Courses | null = null;

  showAddLectureForm = false;
  newLectureName : string = "";
  newLectureDesc : string = "";

  showAddAssignmentForm = false;
  newAssignmentName : string = "";
  newAssignmentDesc : string = "";

  showAddQuizForm = false;
  newQuizName : string = "";
  newQuizDesc : string = "";


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

  addLecture() {
    const trimmedName = this.newLectureName.trim();
    const trimmedDesc = this.newLectureDesc.trim();

    if (!trimmedName || !trimmedDesc) {
      alert('Please fill in both the name and description of the lecture.');
      return;
    }

    if (this.selectedCourse?.id !== undefined) {
      this.instructorService.addLecture(this.selectedCourse.id, this.newLectureName, this.newLectureDesc)
        .subscribe({
          next: (response: any) => {
            const newLecture = new Lecture(
              response.id,
              response.title,
              response.description,
              response.courseId
            );

            this.selectedCourse?.lectures.push(newLecture);
            this.selectedCourse?.lecturesId.push(String(response.id));

            this.newLectureName = '';
            this.newLectureDesc = '';
            this.showAddLectureForm = false;
          }
        });
    }
  }

  addAssignment(){
    const trimmedName = this.newAssignmentName.trim();
    const trimmedDesc = this.newAssignmentDesc.trim();

    if (!trimmedName || !trimmedDesc) {
      alert('Please fill in both the name and description of the Assignment.');
      return;
    }

    if (this.selectedCourse?.id !== undefined) {
      this.instructorService.addAssignment(this.selectedCourse.id, this.newAssignmentName, this.newAssignmentDesc)
        .subscribe({
          next: (response: any) => {
            const newAssignment = new Assignment(
              response.id,
              response.title,
              response.description,
              response.courseId
            );

            this.selectedCourse?.assignments.push(newAssignment);
            this.selectedCourse?.assignmentsId.push(String(response.id));

            this.newAssignmentName = '';
            this.newAssignmentDesc = '';
            this.showAddAssignmentForm = false;
          }
        });
    }
  }

  addQuiz(){
    const trimmedName = this.newQuizName.trim();
    const trimmedDesc = this.newQuizDesc.trim();

    if (!trimmedName || !trimmedDesc) {
      alert('Please fill in both the name and description of the Quiz.');
      return;
    }

    if (this.selectedCourse?.id !== undefined) {
      this.instructorService.addQuiz(this.selectedCourse.id, this.newQuizName, this.newQuizDesc)
        .subscribe({
          next: (response: any) => {
            const newQuiz = new Quiz(
              response.id,
              response.title,
              response.description,
              response.courseId
            );

            this.selectedCourse?.quizzes.push(newQuiz);
            this.selectedCourse?.quizzesId.push(String(response.id));

            this.newQuizName = '';
            this.newQuizDesc = '';
            this.showAddQuizForm = false;
          }
        });
    }
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
