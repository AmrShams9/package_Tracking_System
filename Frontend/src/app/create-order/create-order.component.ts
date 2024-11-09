import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { postData } from "../api";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-create-order",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./create-order.component.html",
  styleUrl: "./create-order.component.css",
})
export class CreateOrderComponent {
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      pickup: ["", [Validators.required]],
      dropOff: ["", [Validators.required]],
      details: ["", [Validators.required]],
      deliveryDate: ["2023-10-07"],
      status: ["Placed"],
    });
  }

  async onSubmit() {
    const token = this.authService.getToken();
    const data = { token: token, ...this.orderForm.value };
    const response = await postData(data, "create-order");
    console.log(response.status);
    this.router.navigate(["/my-orders"]);
  }
}
