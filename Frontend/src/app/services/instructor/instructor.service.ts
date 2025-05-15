import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, switchMap, Observable } from 'rxjs';
import { Courses } from '../../models/courses';
import { Assignment } from '../../models/assignment';
import { Quiz } from '../../models/quiz';
import { Lecture } from '../../models/lecture';
import { Student } from '../../models/student';

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

  addLecture(courseId: number, name: string, description: string): Observable<Lecture> {
    const lecture = {
      title: name,
      description: description,
      courseId: courseId
    };

    return this.http.post<Lecture>(`${this.baseUrl}/lectures`, lecture);
  }


  addAssignment(courseId: number, name: string, description: string): Observable<Assignment> {
    const assignmentPayload = {
      title: name,
      description: description,
      courseId: courseId
    };

    return this.http.get<any>(`${this.baseUrl}/Course/${courseId}`).pipe(
      switchMap(course => {
        const studentIds = course.studentIds?.$values || [];

        return this.http.post<Assignment>(`${this.baseUrl}/assignments`, assignmentPayload).pipe(
          switchMap(createdAssignment => {
            const assignmentId = createdAssignment.id;

            const submissionRequests = studentIds.map((studentId: number) =>
              this.http.post(`${this.baseUrl}/submissions/${studentId}/${assignmentId}`, {})
            );

            return forkJoin(submissionRequests).pipe(
              map(() => createdAssignment)
            );
          })
        );
      })
    );
  }


  addQuiz(courseId: number, name: string, description: string): Observable<Quiz> {
    const quizPayload = {
      title: name,
      description: description,
      courseId: courseId
    };

    return this.http.get<any>(`${this.baseUrl}/Course/${courseId}`).pipe(
      switchMap(course => {
        const studentIds = course.studentIds?.$values || [];

        return this.http.post<Quiz>(`${this.baseUrl}/Quiz`, quizPayload).pipe(
          switchMap(createdQuiz => {
            const quizId = createdQuiz.id;

            const submissionRequests = studentIds.map((studentId: number) =>
              this.http.post(`${this.baseUrl}/StudentQuiz/${studentId}/${quizId}`, {})
            );

            return forkJoin(submissionRequests).pipe(
              map(() => createdQuiz)
            );
          })
        );
      })
    );
  }


  getCourseStudents(studentIds: number[]): Observable<Student[]> {
  const requests = studentIds.map(id =>
    this.http.get<any>(`${this.baseUrl}/students/${id}`).pipe(
      map(res => new Student(
        res.id,
        res.name,
        res.email,
        res.password,
        res.courseIds?.$values || []
      ))
    )
  );

  return forkJoin(requests);
}

  getAssignmentGrade(studentId: number, assignmentId: number): Observable<number | null> {
    const url = `${this.baseUrl}/submissions/${studentId}/${assignmentId}/grade`;
    return this.http.get<{ grade: number | null }>(url).pipe(
      map(response => response.grade)
    );
  }

  getQuizGrade(studentId: number, assignmentId: number): Observable<number | null> {
    const url = `${this.baseUrl}/StudentQuiz/${studentId}/${assignmentId}/grade`;
    return this.http.get<{ grade: number | null }>(url).pipe(
      map(response => response.grade)
    );
  }

  updateAssignmentGrade(studentId: number, assignmentId: number, grade: number): Observable<any> {
    const url = `${this.baseUrl}/submissions/${studentId}/${assignmentId}/grade`;
    const body = { grade: grade };
    return this.http.put(url, body);
  }

  updateQuizGrade(studentId: number, assignmentId: number, grade: number): Observable<any> {
    const url = `${this.baseUrl}/StudentQuiz/${studentId}/${assignmentId}/grade`;
    const body = { grade: grade };
    return this.http.put(url, body);
  }


  addCourse( instructorId: number, title: string, description: string, duration: string, level: string, lectureCount: string, sectionCount: string ) {
    const body = {
      title: title,
      description: description,
      durationInHours: parseInt(duration),
      level: level,
      sectionCount: parseInt(sectionCount),
      lectureCount: parseInt(lectureCount),
      instructorId: instructorId,
      studentIds: [],
      assignmentIds: [],
      lectureIDS: [],
      quizIds: [],
    };

    return this.http.post(`${this.baseUrl}/Course`, body);
  }

}
