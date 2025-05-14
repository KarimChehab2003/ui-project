export class Courses {
    constructor (
        public name: string,
        public description : string,
        public durationInHour : number,
        public level : string,
        public sectionCount : number,
        public lectureCount : number,
        public lectures: string[],
        public assignments: string[],
        public quizzes: string[],
        public instructorId : number,
        public enrolledStudents: number[],
    ){}
}