import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { postData } from "../api";

@Component({
  selector: "app-create-order",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./create-order.component.html",
  styleUrl: "./create-order.component.css",
})
export class CreateOrderComponent {
  orderForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.orderForm = this.fb.group({
      pickup: ["", [Validators.required]],
      dropOff: ["", [Validators.required]],
      details: ["", [Validators.required]],
      deliveryTime: ["2023-10-07"],
    });
  }

  async onSubmit() {
    console.log(this.orderForm.value);
    const response = await postData(this.orderForm.value, "place-order");
    console.log(response.json());
  }
}
