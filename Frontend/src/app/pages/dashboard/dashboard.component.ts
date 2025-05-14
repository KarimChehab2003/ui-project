import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StylishProfileViewerComponent } from './stylishProfileViewer/stylish-profile-viewer/stylish-profile-viewer.component';
import { DashboardOverviewComponent } from './dashboardOverview/dashboard-overview/dashboard-overview.component';
import { ActivityDashboardViewerComponent } from './ActivtiyDashBoardView/activity-dashboard-viewer/activity-dashboard-viewer.component';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule ,CommonModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

 loggedInUser:Student = new Student(0,'','','',[]);


constructor(){
  
let userData = localStorage.getItem('user');

this.loggedInUser = userData ? JSON.parse(userData) : null;
}


}
