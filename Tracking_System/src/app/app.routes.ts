import { Routes } from '@angular/router';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'register', loadComponent: () => import('./user-registration/user-registration.component').then(m => m.UserRegistrationComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: '**', redirectTo: 'login' } // Default to login page
];
