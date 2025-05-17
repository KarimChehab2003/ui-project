import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student';
import { StudentCourseService } from '../../services/student-course/student-course.service';
import { Courses } from '../../models/courses';
import { BehaviorSubject } from 'rxjs';
import { StudentService } from '../../services/student/student.service';
import { Instructor } from '../../models/instructor';
import { QuizserviceService } from '../../services/quiz/quizservice.service';
import { LectureServiceService } from '../../services/lecture/lecture-service.service';
import { Lecture } from '../../models/lecture';
import { Quiz } from '../../models/quiz';
import { AssignmentService } from '../../services/assignment/assignment.service';
import { Assignment } from '../../models/assignment';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { DashboardOverviewComponent } from './dashboardOverview/dashboard-overview/dashboard-overview.component';
import { ActivityDashboardViewerComponent } from './ActivtiyDashBoardView/activity-dashboard-viewer/activity-dashboard-viewer.component';
import { StylishProfileViewerComponent } from './stylishProfileViewer/stylish-profile-viewer/stylish-profile-viewer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ActivityDashboardViewerComponent,
    DashboardOverviewComponent,
    StylishProfileViewerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
