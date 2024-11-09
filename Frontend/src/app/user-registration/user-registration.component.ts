import { Component } from "@angular/core";
import { postData } from "../api";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog"; // Import MatDialog
import { LoginErrorComponent } from "../login-error/login-error.component"; // Import the error dialog component
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-registration",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./user-registration.component.html",
  styleUrls: ["./user-registration.component.css"],
})
export class UserRegistrationComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {
    this.registrationForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      role: [""],
    });
  }

  isChecked(value: string): boolean {
    return this.registrationForm.get("role")?.value === value;
  }

  toggleValue(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.registrationForm
      .get("role")
      ?.setValue(isChecked ? "courier" : "customer");
  }

  async onSubmit() {
    if (this.registrationForm.valid) {
      if (this.authService.isLoggedIn()) {
        this.authService.logout();
      }
      if (this.registrationForm.value.role === "") {
        this.registrationForm.value.role = "customer";
      }
      console.log(this.registrationForm.value);
      const response = await postData(this.registrationForm.value, "register");
      const data = await response.json();
      if (response.status !== 201) {
        this.openErrorDialog("Registration failed. Please try again."); // Pass a specific error message
      } else {
        this.authService.storeToken(data.access_token);
        this.router.navigate(["/"]);
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
