import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, switchMap } from 'rxjs';
import { Courses } from '../../models/courses';
import { Assignment } from '../../models/assignment';
import { Quiz } from '../../models/quiz';
import { Lecture } from '../../models/lecture';

@Injectable({
  providedIn: 'root'
})

export class InstructorService {

  private baseUrl = 'http://localhost:5090/api';

  constructor(private http: HttpClient) {}


  getInstructorCourses(instructorId: number) {
    return this.http.get<any>(`${this.baseUrl}/Instructor/${instructorId}`).pipe(
      switchMap(instructor => {
        const courseIds: number[] = instructor.courseIds.$values || [];

        const courseRequests = courseIds.map(courseId =>
          this.http.get<any>(`${this.baseUrl}/Course/${courseId}`).pipe(
            switchMap(courseData => {
              const assignmentsIds: number[] = courseData.assignmentIds?.$values || [];
              const quizIds: number[] = courseData.quizIds?.$values || [];
              const lectureIds: number[] = courseData.lectureIDS?.$values || [];

              const assignmentRequests = assignmentsIds.map(id =>
                this.http.get<any>(`${this.baseUrl}/assignments/${id}`)
              );

              const quizRequests = quizIds.map(id =>
                this.http.get<any>(`${this.baseUrl}/Quiz/${id}`)
              );

              const lectureRequests = lectureIds.map(id =>
                this.http.get<any>(`${this.baseUrl}/lectures/${id}`)
              );
              
              return forkJoin({
                assignments: forkJoin(assignmentRequests.length ? assignmentRequests : [Promise.resolve([])]),
                quizzes: forkJoin(quizRequests.length ? quizRequests : [Promise.resolve([])]),
                lectures: forkJoin(lectureRequests.length ? lectureRequests : [Promise.resolve([])])
              }).pipe(
                map(({ assignments, quizzes, lectures }) => {
                  const course = new Courses(
                    courseData.id,
                    courseData.title,
                    courseData.description,
                    courseData.durationInHours,
                    courseData.level,
                    courseData.sectionCount,
                    courseData.lectureCount,
                    lectureIds.map(id => id.toString()),
                    assignmentsIds.map(id => id.toString()),
                    quizIds.map(id => id.toString()),
                    courseData.instructorId,
                    courseData.studentIds?.$values || [],
                    assignments.map(a => new Assignment(a.id, a.title, a.description, a.courseId)),
                    quizzes.map(q => new Quiz(q.id, q.title, q.description, q.courseId)),
                    lectures.map(l => new Lecture(l.id, l.title, l.description, l.courseId))
                  );
                  return course;
                })
              );
            })
          )
        );
        return forkJoin(courseRequests);
      })
    );
  }

}
