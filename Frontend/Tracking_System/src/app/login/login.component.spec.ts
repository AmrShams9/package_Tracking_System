// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule] // Add ReactiveFormsModule here
// })
// export class LoginComponent {
//   loginForm: FormGroup;

//   constructor(private fb: FormBuilder) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   onLogin() {
//     if (this.loginForm.valid) {
//       console.log(this.loginForm.value);
//       // Implement actual login logic here
//     } else {
//       console.log('Form is invalid');
//     }
//   }
// }
