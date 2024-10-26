import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-login-error",
  standalone: true,
  imports: [],
  templateUrl: "./login-error.component.html",
  styleUrls: ["./login-error.component.css"], // Fixed typo from styleUrl to styleUrls
  encapsulation: ViewEncapsulation.None,
})
export class LoginErrorComponent {
  constructor(
    private dialogRef: MatDialogRef<LoginErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string } // Inject the data
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
