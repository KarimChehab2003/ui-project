import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Assignment {
  student: string;
  course: string;
  date: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  // Sample data - you would typically get this from a service
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student' },
  ];

  courses = [
    {
      id: 'C001',
      name: 'Web Development',
      instructor: 'Jane Smith',
      duration: '12 weeks',
    },
  ];

  assignments = [
    { student: 'John Doe', course: 'Web Development', date: '2024-03-20' },
  ];

  // Search terms
  userSearchTerm: string = '';
  courseSearchTerm: string = '';

  constructor() {}

  ngOnInit() {}

  // Navigation handling
  switchSection(sectionId: string) {
    // Remove active class from all sections
    document.querySelectorAll('.section').forEach((section) => {
      section.classList.remove('active');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.nav-links li').forEach((link) => {
      link.classList.remove('active');
    });

    // Add active class to selected section and nav link
    document.getElementById(sectionId)?.classList.add('active');
    document
      .querySelector(`[data-section="${sectionId}"]`)
      ?.classList.add('active');
  }

  // Search functionality
  filterUsers() {
    const searchTerm = this.userSearchTerm.toLowerCase();
    const rows = document.querySelectorAll('#users tbody tr');

    rows.forEach((row) => {
      const text = row.textContent?.toLowerCase() || '';
      (row as HTMLElement).style.display = text.includes(searchTerm)
        ? ''
        : 'none';
    });
  }

  filterCourses() {
    const searchTerm = this.courseSearchTerm.toLowerCase();
    const rows = document.querySelectorAll('#courses tbody tr');

    rows.forEach((row) => {
      const text = row.textContent?.toLowerCase() || '';
      (row as HTMLElement).style.display = text.includes(searchTerm)
        ? ''
        : 'none';
    });
  }

  // Button actions
  addNewUser() {
    alert('Add user functionality would be implemented here');
  }

  addNewCourse() {
    alert('Add course functionality would be implemented here');
  }

  editItem(type: string, id: number | string) {
    alert(`Edit ${type} functionality would be implemented here`);
  }

  deleteItem(type: string, item: number | string | Assignment) {
    if (confirm('Are you sure you want to delete this item?')) {
      if (type === 'assignment') {
        const assignment = item as Assignment;
        // Remove the assignment from the array
        this.assignments = this.assignments.filter(
          (a) =>
            a.student !== assignment.student ||
            a.course !== assignment.course ||
            a.date !== assignment.date
        );
      } else {
        // Handle other types (user, course) by ID
        alert(`Delete ${type} functionality would be implemented here`);
      }
    }
  }

  assignCourse() {
    const student = (document.getElementById('student') as HTMLSelectElement)
      .value;
    const course = (document.getElementById('course') as HTMLSelectElement)
      .value;

    if (!student || !course) {
      alert('Please select both a student and a course');
      return;
    }

    alert('Course assignment would be implemented here');
  }
}
