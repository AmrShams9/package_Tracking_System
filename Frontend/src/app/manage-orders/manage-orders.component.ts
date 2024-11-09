import { Component, OnInit } from "@angular/core";
import { Order } from "../my-orders/my-orders.component";
import { getData, postData } from "../api";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { LoginErrorComponent } from "../login-error/login-error.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-manage-orders",
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, RouterLink],
  templateUrl: "./manage-orders.component.html",
  styleUrls: ["./manage-orders.component.css"],
})
export class ManageOrdersComponent implements OnInit {
  courierId: string = "";
  orders: Order[] = [];
  visibleStatus: { [key: number]: boolean } = {};

  constructor(private dialog: MatDialog) {}

  async ngOnInit() {
    await this.fetchOrders();
  }

  async fetchOrders() {
    try {
      const response = await getData("get-all-orders");
      this.orders = await response.json();
      console.log("Orders fetched successfully:", this.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  toggleVisibility(orderId: number) {
    this.visibleStatus[orderId] = !this.visibleStatus[orderId];
  }

  async updateStatus(event: MouseEvent, orderId: number) {
    const target = event.target as HTMLElement;
    if (target.classList.contains("option")) {
      const newStatus = target.innerHTML; // Get the new status from the clicked option
      console.log(newStatus);

      const response = await postData(
        { orderId: orderId, status: newStatus },
        "update-order-status"
      );

      if (response.ok) {
        const order = this.orders.find((order) => order.order_id === orderId);
        if (order) {
          order.status = newStatus;
        }
      }
    }
  }

  async assignOrder(orderId: number, courierId: string) {
    if (courierId === "" || isNaN(Number(courierId))) {
      this.openErrorDialog("The value entered is not a number.");
      return;
    }

    try {
      const response = await postData(
        { orderId: orderId, courierId: courierId },
        "assign-order-to-courier"
      );

      if (response.ok) {
        console.log(
          `Order ${orderId} assigned to courier ${courierId}:`,
          response
        );

        const order = this.orders.find((order) => order.order_id === orderId);
        if (order) {
          order.courier_id = Number(courierId);
        }
      } else {
        const message = await response.text();
        const parsedResponse = JSON.parse(message);
        const message1 = parsedResponse.message;
        this.openErrorDialog(
          message1 || "An error occurred while processing the response."
        );
      }
    } catch (error) {
      this.openErrorDialog("Error while assigning order.");
      console.error("Error while assigning order:", error);
    }
  }

  async deleteOrder(orderId: number) {
    const response = await postData({ orderId: orderId }, "delete-order");
    if (response.ok) {
      const index = this.orders.findIndex(
        (order) => order.order_id === orderId
      );

      if (index !== -1) {
        this.orders.splice(index, 1);
        console.log(`Order with id ${orderId} removed.`);
      } else {
        console.log(`Order with id ${orderId} not found.`);
      }
    }
  }

  openErrorDialog(message: string) {
    this.dialog.open(LoginErrorComponent, {
      panelClass: "custom-dialog-container",
      disableClose: true,
      data: { message },
    });
  }
}
