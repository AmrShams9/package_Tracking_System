import { Component } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { LoginErrorComponent } from "../login-error/login-error.component";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth.service";
import { lastValueFrom } from "rxjs";
import { jwtDecode } from "jwt-decode";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      if (this.authService.isLoggedIn()) {
        this.authService.logout();
      }

      try {
        const response = await this.authService.login(
          this.loginForm.value.email,
          this.loginForm.value.password
        );

        this.authService.storeToken(response.access_token);
        this.router.navigate(["/"]);
      } catch (err) {
        console.error("Login failed", err);
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
