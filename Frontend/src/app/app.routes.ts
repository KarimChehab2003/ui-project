import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InstructorComponent } from './pages/instructor/instructor.component';
import { InstructorCourseComponent } from './pages/instructor-course/instructor-course.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { StudentCourseComponent } from './pages/student-course/student-course.component';

export const routes: Routes = [
    {path: '',component: SigninComponent},
    {path: 'register',component: SignupComponent},
    {path: 'admin',component: AdminComponent},
    {path: 'instructor',component: InstructorComponent},
    {path: 'instructor-course',component: InstructorCourseComponent},
    {path: 'student-course',component: StudentCourseComponent},
    {path: 'dashboard',component: DashboardComponent }
];
