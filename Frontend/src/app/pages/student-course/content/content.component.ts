import { Component } from '@angular/core';
import { StudentCourseService } from '../../../services/student-course/student-course.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Student } from '../../../models/student';
@Component({
  selector: 'app-content',
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  selectedCourse: any | null;
  instructorName: string = '';
  assignments: any[] = [];
  submittedAssignments: Set<number> = new Set();
  user: Student | null = null;
  
  constructor(studentCourseService: StudentCourseService, private http: HttpClient){
    this.user = studentCourseService.getUser();
    studentCourseService.selectedCourse.subscribe((course)=> {
      this.selectedCourse = course;
      console.log(this.selectedCourse);
      if(this.selectedCourse)
      {
        this.fetchInstructorName();
        this.fetchAssignments();
      }
    });

    const storedAssignments = localStorage.getItem("submittedAssignments");
    if(storedAssignments){
      this.submittedAssignments = new Set<number>(JSON.parse(storedAssignments))
    }
    
  }

  fetchInstructorName(){
    this.http.get<any>(`http://localhost:5090/api/Instructor/${this.selectedCourse.instructorId}`).subscribe((response)=> this.instructorName = response.name)
  }

  fetchAssignments(){
    const requests = this.selectedCourse.assignmentIds.$values.map((id: any) => 
      this.http.get<any>(`http://localhost:5090/api/assignments/${id}`)
    );

    // using forkJoin to wait till all responses arrives
    forkJoin<any[]>(requests).subscribe((responses: any[]) => {
      this.assignments = responses.filter(assignment => 
        assignment.courseId === this.selectedCourse.id
      );
      console.log("Filtered assignments: ", this.assignments);
    });
  }

  submitAssignment(assignmentId: number){
    this.http.post<any>(`http://localhost:5090/api/submissions/${this.user?.id}/${assignmentId}`, {}).subscribe(()=>{
      this.submittedAssignments.add(assignmentId)
      localStorage.setItem("submittedAssignments",JSON.stringify([...this.submittedAssignments]));
      console.log(this.submittedAssignments);
    })
  }
}
