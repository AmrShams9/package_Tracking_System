import { Component } from "@angular/core";
import { registerUser } from "../api";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog"; // Import MatDialog
import { LoginErrorComponent } from "../login-error/login-error.component"; // Import the error dialog component

@Component({
  selector: "app-user-registration",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./user-registration.component.html",
  styleUrls: ["./user-registration.component.css"],
})
export class UserRegistrationComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.registrationForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
      const response = await registerUser(this.registrationForm.value);

      if (response.status !== 201) {
        this.openErrorDialog("Registration failed. Please try again."); // Pass a specific error message
      } else {
        // Handle successful registration logic here
      }
    } else {
      console.log("Form is invalid");
    }
  }

  openErrorDialog(message: string) {
    this.dialog.open(LoginErrorComponent, {
      panelClass: "custom-dialog-container",
      disableClose: true,
      data: { message }, // Pass the error message to the dialog
    });
  }
}
