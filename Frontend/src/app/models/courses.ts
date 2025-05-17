import { Assignment } from './assignment';
import { Quiz } from './quiz';
import { Lecture } from './lecture';

export class Courses {
  constructor(
    public id: number,
    public title: string,
    public description: string,

    public durationInHours: number,
    public level: string,
    public sectionCount: number,
    public lectureCount: number,

    public lecturesId: string[],
    public assignmentsId: string[],
    public quizzesId: string[],

    public instructorId: number,
    public enrolledStudents: number[],

    public assignments: Assignment[] = [],
    public quizzes: Quiz[] = [],
    public lectures: Lecture[] = []
  ) {}
}
