import { Component } from '@angular/core';
import { StudentCourseService } from '../../../services/student-course/student-course.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-content',
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  selectedCourse: any | null;
  instructorName: string = '';

  constructor(studentCourseService: StudentCourseService, private http: HttpClient){
    studentCourseService.selectedCourse.subscribe((course)=> {
      this.selectedCourse = course;
      console.log(this.selectedCourse);
      if(this.selectedCourse)
        this.fetchInstructorName();
    });
    
  }

  fetchInstructorName(){
    this.http.get<any>(`http://localhost:5090/api/Instructor/${this.selectedCourse.instructorId}`).subscribe((response)=> this.instructorName = response.name)
  }
}
