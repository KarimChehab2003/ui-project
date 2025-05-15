export class Course {
  constructor(
    public id: number,
    public name: string,
    public instructor: string,
    public duration: string,
    public lectureCount: number,
    public sectionCount: number,
    public level: string,
    public description: string
  ) {}
}
