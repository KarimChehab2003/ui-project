import { Component } from '@angular/core';
import { Student } from '../../../models/student';
@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  user: Student | null = null;
 constructor() {
  const retrievedUser = localStorage.getItem("user")
  this.user = retrievedUser ? JSON.parse(retrievedUser) as Student : null;
 }
}
