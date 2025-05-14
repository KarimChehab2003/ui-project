export class Courses {
    constructor (
        public name: string,
        public description : string,
        public lectures: string[],
        public assignments: string[],
        public quizzes: string[],
        public instructorId : number,
        public enrolledStudents: number[],
    ){}
}