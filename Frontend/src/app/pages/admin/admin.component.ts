import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { Student } from '../../models/student';
import { Instructor } from '../../models/instructor';
import { Admin } from '../../models/admin';
import { Course } from '../../models/course';

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
  // Sample data using models
  students: Student[] = [];

  instructors: Instructor[] = [];

  admins: Admin[] = [];

  courses: Course[] = [];

  assignments: Assignment[] = [];

  // Search terms
  userSearchTerm: string = '';
  courseSearchTerm: string = '';

  // New user form data
  showAddUserForm = false;
  showEditUserForm = false;
  newUser: Student | Instructor = new Student(0, '', '', '', []);
  selectedRole: 'student' | 'instructor' = 'student';
  editingUser: Student | Instructor | null = null;

  // Course-related properties
  showAddCourseForm = false;
  showEditCourseForm = false;
  newCourse: Course = new Course(0, '', '', '', 0, 0, '', '');
  editingCourse: Course | null = null;

  pendingStudents: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    // Initialize the instructor hashmap with existing instructors
  }

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

    if (sectionId === 'approve-students') {
      this.getPendingStudents();
    }
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

  getStudents() {
    this.adminService.getStudents().subscribe({
      next: (students) => {
        const studentArray = students?.$values ?? students;
        this.students = studentArray;
        this.displayAssignments(); // Update assignments table
      },
      error: (error) => {
        alert(
          'Error fetching students: ' + (error.error?.message || error.message)
        );
      },
    });
  }

  getInstructors() {
    this.adminService.getInstructors().subscribe({
      next: (instructors) => {
        // If the response has $values, use it; otherwise, use the response directly
        const instructorArray = instructors?.$values ?? instructors;
        this.instructors = instructorArray;
        console.log('Instructors array:', this.instructors);
      },
      error: (error) => {
        alert(
          'Error fetching instructors: ' +
            (error.error?.message || error.message)
        );
      },
    });
  }

  // Button actions
  addNewUser() {
    this.showAddUserForm = true;
    this.showEditUserForm = false;
    this.selectedRole = 'student';
    this.newUser =
      this.selectedRole === 'student'
        ? new Student(0, '', '', '', [])
        : new Instructor(0, '', '', '', []);
  }

  submitNewUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      alert('Please fill in all fields');
      return;
    }

    const userData = {
      name: this.newUser.name.toString(),
      email: this.newUser.email.toString(),
      password: this.newUser.password.toString(),
    };

    this.adminService.addNewUser(this.selectedRole, userData).subscribe({
      next: (response) => {
        // Add the new user to the appropriate table
        if (this.selectedRole === 'student') {
          this.students.push(
            new Student(
              response.id,
              userData.name,
              userData.email,
              userData.password,
              []
            )
          );
        } else {
          this.instructors.push(
            new Instructor(
              response.id,
              userData.name,
              userData.email,
              userData.password,
              []
            )
          );
        }

        // Reset form and hide it
        this.resetUserForm();
      },
      error: (error) => {
        alert(`Error adding ${this.selectedRole}: ` + error.message);
      },
    });
  }

  // Add users property that references students
  get users() {
    return this.students;
  }

  editItem(type: string, id: string | number) {
    if (type === 'student') {
      const student = this.students.find((s) => s.id === Number(id));
      if (student) {
        this.editingUser = student;
        this.selectedRole = 'student';
        this.newUser = new Student(
          student.id,
          student.name,
          student.email,
          '', // Password is empty for editing
          student.coursesIds
        );
        this.showEditUserForm = true;
        this.showAddUserForm = false;
      }
    } else if (type === 'instructor') {
      const instructor = this.instructors.find((i) => i.id === Number(id));
      if (instructor) {
        this.editingUser = instructor;
        this.selectedRole = 'instructor';
        this.newUser = new Instructor(
          instructor.id,
          instructor.name,
          instructor.email,
          '', // Password is empty for editing
          instructor.coursesIds
        );
        this.showEditUserForm = true;
        this.showAddUserForm = false;
      }
    }
  }

  submitEditUser() {
    if (!this.editingUser || !this.newUser.name || !this.newUser.email) {
      alert('Please fill in all required fields');
      return;
    }

    const userData = {
      name: this.newUser.name.toString(),
      email: this.newUser.email.toString(),
      password:
        this.newUser.password?.toString() ||
        this.editingUser.password.toString(),
      coursesIds: this.editingUser.coursesIds,
    };

    this.adminService
      .updateUser(this.selectedRole, this.editingUser.id, userData)
      .subscribe({
        next: (response) => {
          // Update the user in the appropriate table
          if (this.selectedRole === 'student') {
            const index = this.students.findIndex(
              (s) => s.id === this.editingUser?.id
            );
            if (index !== -1 && this.editingUser) {
              this.students[index] = new Student(
                this.editingUser.id,
                userData.name,
                userData.email,
                userData.password,
                userData.coursesIds
              );
            }
          } else {
            const index = this.instructors.findIndex(
              (i) => i.id === this.editingUser?.id
            );
            if (index !== -1 && this.editingUser) {
              this.instructors[index] = new Instructor(
                this.editingUser.id,
                userData.name,
                userData.email,
                userData.password,
                userData.coursesIds
              );
            }
          }
          this.resetUserForm();
        },
        error: (error) => {
          console.error('Update error:', error);
          alert(
            `Error updating ${this.selectedRole}: ` +
              (error.error?.message || error.message)
          );
        },
      });
  }

  deleteItem(type: string, id: string | number | Assignment) {
    if (type === 'student') {
      if (confirm('Are you sure you want to delete this student?')) {
        const student = this.students.find((s) => s.id === Number(id));
        if (student) {
          this.adminService.deleteUser('student', student.id).subscribe({
            next: () => {
              this.students = this.students.filter((s) => s.id !== student.id);
              this.displayAssignments();
            },
            error: (error) => {
              alert('Error deleting student: ' + error.message);
            },
          });
        }
      }
    } else if (type === 'instructor') {
      if (confirm('Are you sure you want to delete this instructor?')) {
        const instructor = this.instructors.find((i) => i.id === Number(id));
        if (instructor) {
          this.adminService.deleteUser('instructor', instructor.id).subscribe({
            next: () => {
              this.instructors = this.instructors.filter(
                (i) => i.id !== instructor.id
              );
            },
            error: (error) => {
              alert('Error deleting instructor: ' + error.message);
            },
          });
        }
      }
    } else if (type === 'course') {
      alert(`Delete ${type} functionality would be implemented here`);
    } else if (type === 'assignment') {
      if (confirm('Are you sure you want to delete this assignment?')) {
        const assignment = id as Assignment;
        // Find the student and course
        const student = this.students.find(
          (s) => s.name.toString() === assignment.student
        );
        const course = this.courses.find((c) => c.name === assignment.course);
        if (student && course && Array.isArray(student.coursesIds)) {
          // Remove the courseId from the student's coursesIds
          student.coursesIds = student.coursesIds.filter(
            (cid) => cid !== course.id
          );
          this.displayAssignments();
        }
      }
    }
  }

  private resetUserForm() {
    this.newUser =
      this.selectedRole === 'student'
        ? new Student(0, '', '', '', [])
        : new Instructor(0, '', '', '', []);
    this.showAddUserForm = false;
    this.showEditUserForm = false;
    this.editingUser = null;
  }

  cancelAddUser() {
    this.resetUserForm();
  }

  // Course management methods
  addNewCourse() {
    this.getInstructors(); // Always refresh instructors
    this.showAddCourseForm = true;
    this.showEditCourseForm = false;
    this.newCourse = new Course(0, '', '', '', 0, 0, '', '');
  }

  submitNewCourse() {
    if (
      !this.newCourse.name ||
      !this.newCourse.instructor ||
      !this.newCourse.duration
    ) {
      alert('Please fill in all required fields');
      return;
    }

    const instructorId = Number(this.newCourse.instructor);
    if (!instructorId) {
      alert('Invalid instructor selected');
      return;
    }

    const courseData = {
      title: this.newCourse.name,
      description: this.newCourse.description,
      durationInHours: Number(this.newCourse.duration),
      level: this.newCourse.level,
      sectionCount: this.newCourse.sectionCount,
      lectureCount: this.newCourse.lectureCount,
      instructorId: instructorId,
      studentIds: [],
      assignmentIds: [],
      lectureIDS: [],
      quizIds: [],
    };

    this.adminService.addCourse(courseData).subscribe({
      next: (response: any) => {
        this.courses.push(
          new Course(
            response.id,
            courseData.title,
            String(courseData.instructorId),
            courseData.durationInHours.toString(),
            courseData.lectureCount,
            courseData.sectionCount,
            courseData.level,
            courseData.description
          )
        );
        this.resetCourseForm();
      },
      error: (error: any) => {
        alert('Error adding course: ' + error.message);
      },
    });
  }

  editCourse(id: number) {
    this.getInstructors(); // Always refresh instructors
    const course = this.courses.find((c) => c.id === id);
    if (course) {
      this.editingCourse = course;
      this.newCourse = new Course(
        course.id,
        course.name,
        course.instructor, // This should be the instructor's ID as a string
        course.duration,
        course.lectureCount,
        course.sectionCount,
        course.level,
        course.description
      );
      this.showEditCourseForm = true;
      this.showAddCourseForm = false;
    }
  }

  submitEditCourse() {
    if (
      !this.editingCourse ||
      !this.newCourse.name ||
      !this.newCourse.instructor ||
      !this.newCourse.duration
    ) {
      alert('Please fill in all required fields');
      return;
    }

    const instructorId = Number(this.newCourse.instructor);
    if (!instructorId) {
      alert('Invalid instructor selected');
      return;
    }

    const courseData = {
      title: this.newCourse.name,
      description: this.newCourse.description,
      durationInHours: Number(this.newCourse.duration),
      level: this.newCourse.level,
      sectionCount: this.newCourse.sectionCount,
      lectureCount: this.newCourse.lectureCount,
      instructorId: instructorId,
      studentIds: [],
      assignmentIds: [],
      lectureIDs: [],
      quizIds: [],
    };

    this.adminService
      .updateCourse(Number(this.editingCourse.id), courseData)
      .subscribe({
        next: (response) => {
          const index = this.courses.findIndex(
            (c) => c.id === this.editingCourse?.id
          );
          if (index !== -1 && this.editingCourse) {
            this.courses[index] = new Course(
              this.editingCourse.id,
              courseData.title,
              String(courseData.instructorId),
              courseData.durationInHours.toString(),
              courseData.lectureCount,
              courseData.sectionCount,
              courseData.level,
              courseData.description
            );
          }
          this.resetCourseForm();
        },
        error: (error) => {
          alert(
            'Error updating course: ' + (error.error?.message || error.message)
          );
        },
      });
  }

  deleteCourse(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.adminService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter((c) => c.id !== id);
        },
        error: (error) => {
          alert(
            'Error deleting course: ' + (error.error?.message || error.message)
          );
        },
      });
    }
  }

  private resetCourseForm() {
    this.newCourse = new Course(0, '', '', '', 0, 0, '', '');
    this.showAddCourseForm = false;
    this.showEditCourseForm = false;
    this.editingCourse = null;
  }

  cancelAddCourse() {
    this.resetCourseForm();
  }

  getCourses() {
    this.adminService.getCourses().subscribe({
      next: (courses) => {
        const courseArray = courses?.$values ?? courses;
        this.courses = courseArray.map((c: any) => ({
          id: c.id,
          name: c.title,
          instructor: c.instructorId || c.instructor || '',
          duration: c.durationInHours
            ? c.durationInHours.toString()
            : c.duration || '',
          lectureCount: c.lectureCount || 0,
          sectionCount: c.sectionCount || 0,
          level: c.level || '',
          description: c.description || '',
        }));
        console.log('Courses array:', this.courses);
        this.displayAssignments(); // Update assignments table
      },
      error: (error) => {
        alert(
          'Error fetching courses: ' + (error.error?.message || error.message)
        );
      },
    });
  }

  showAssignmentForm() {
    this.getStudents();
    this.getCourses();
    this.getInstructors();
  }

  assignCourse() {
    const studentId = Number(
      (document.getElementById('student') as HTMLSelectElement).value
    );
    const courseId = Number(
      (document.getElementById('course') as HTMLSelectElement).value
    );
    if (!studentId || !courseId) {
      alert('Please select both a student and a course');
      return;
    }
    this.adminService.assignStudentToCourse(courseId, studentId).subscribe({
      next: () => {
        const student = this.students.find((s) => s.id === studentId);
        if (student) {
          if (!Array.isArray(student.coursesIds)) {
            student.coursesIds = [];
          }
          if (!student.coursesIds.includes(courseId)) {
            student.coursesIds.push(courseId);
          }
        }
        alert('Course assigned successfully!');
        this.getCourses();
        this.displayAssignments(); // Update assignments table
      },
      error: (error) => {
        alert(
          'Error assigning course: ' + (error.error?.message || error.message)
        );
      },
    });
  }

  displayAssignments() {
    // Build assignments from students and their coursesIds
    this.assignments = [];
    this.students.forEach((student) => {
      if (Array.isArray(student.coursesIds)) {
        student.coursesIds.forEach((courseId) => {
          const course = this.courses.find((c) => c.id === courseId);
          if (course) {
            this.assignments.push({
              student: student.name.toString(),
              course: course.name,
              date: new Date().toLocaleDateString(), // You can replace with real date if available
            });
          }
        });
      }
    });
  }

  // Helper method to get instructor name by ID
  getInstructorNameById(id: number): string {
    const instructor = this.instructors.find((i) => i.id === id);
    return instructor ? instructor.name.toString() : 'Unknown Instructor';
  }

  getPendingStudents() {
    this.adminService.getPendingStudents().subscribe({
      next: (students) => {
        const studentArray = students?.$values ?? students;
        if (!studentArray || studentArray.length === 0) {
          alert('No pending students');
          return;
        }
        this.pendingStudents = studentArray;
      },
      error: (error) => {
        alert(
          'Error fetching pending students: ' +
            (error.error?.message || error.message)
        );
      },
    });
  }

  approveStudent(student: any) {
    this.adminService.approveStudent(student).subscribe({
      next: () => {
        this.adminService.removePendingStudent(student.id).subscribe({
          next: () => this.getPendingStudents(),
          error: (error) => {
            alert(
              'Error removing pending student: ' +
                (error.error?.message || error.message)
            );
          },
        });
      },
      error: (error) => {
        alert(
          'Error approving student: ' + (error.error?.message || error.message)
        );
      },
    });
  }
}
