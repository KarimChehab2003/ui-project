import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Course {
  name: string;
  lectures: string[];
  assignments: string[];
  quizzes: string[];
}

@Component({
  selector: 'app-instructor-course',
  templateUrl: './instructor-course.component.html',
  styleUrl: './instructor-course.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class InstructorCourseComponent {
  coursesExpanded = true;
  courses: Course[] = [
    {
      name: 'Course 1',
      lectures: ['Lecture 1.1 - Overview', 'Lecture 1.2 - HTML Basics'],
      assignments: ['Assignment 1.', 'Assignment 2'],
      quizzes: ['Quiz 1.', 'Quiz 2'],
    },
    {
      name: 'Course 2',
      lectures: ['Lecture 2.1 - Intro', 'Lecture 2.2 - CSS Basics'],
      assignments: ['Assignment 1', 'Assignment 2'],
      quizzes: ['Quiz 1', 'Quiz 2'],
    },
    {
      name: 'Course 3',
      lectures: ['Lecture 3.1 - JS Intro'],
      assignments: ['Assignment 1'],
      quizzes: ['Quiz 1'],
    },
    {
      name: 'Course 4',
      lectures: ['Lecture 4.1 - Angular'],
      assignments: ['Assignment 1'],
      quizzes: ['Quiz 1'],
    },
  ];
  selectedCourse: Course = this.courses[0];

  toggleCourses() {
    this.coursesExpanded = !this.coursesExpanded;
  }

  selectCourse(course: Course, event: Event) {
    event.stopPropagation();
    this.selectedCourse = course;
  }
}
