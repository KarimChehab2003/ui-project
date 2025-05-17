import { Component } from '@angular/core';
import { Student } from '../../../../models/student';
@Component({
  selector: 'app-stylish-profile-viewer',
  imports: [],
  templateUrl: './stylish-profile-viewer.component.html',
  styleUrl: './stylish-profile-viewer.component.css',
})
export class StylishProfileViewerComponent {
  public loggedInUser: Student | null = null;

  constructor() {
    this.loadUser();
  }

  loadUser() {
    const retrievedUser = localStorage.getItem('user');
    this.loggedInUser = retrievedUser
      ? (JSON.parse(retrievedUser) as Student)
      : null;
    // console.log(this.loggedInUser);
  }
}
