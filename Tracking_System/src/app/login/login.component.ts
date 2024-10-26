import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginErrorComponent } from "../login-error/login-error.component";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { loginUser } from "../api";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      const response = await loginUser(this.loginForm.value);

      if (response.status !== 200) {
        this.openErrorDialog(
          "Incorrect username or password. Please try again."
        );
      }
    } else {
      console.log("Form is invalid");
    }
  }

  openErrorDialog(message: string) {
    this.dialog.open(LoginErrorComponent, {
      panelClass: "custom-dialog-container", // Use the custom class for styling
      disableClose: true, // Prevent closing on backdrop click
      data: { message },
    });
  }
}
