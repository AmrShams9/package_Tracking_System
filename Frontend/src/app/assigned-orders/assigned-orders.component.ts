import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Order } from "../my-orders/my-orders.component";
import { getData, postData } from "../api";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-assigned-orders",
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: "./assigned-orders.component.html",
  styleUrl: "./assigned-orders.component.css",
})
export class AssignedOrdersComponent implements OnInit {
  orders: Order[] = [];
  visibleStatus: { [key: number]: boolean } = {};

  constructor(private router: Router, private dialog: MatDialog) {}

  async ngOnInit() {
    await this.fetchOrders();
  }

  async fetchOrders() {
    try {
      const response = await getData("assigned-orders");
      this.orders = await response.json();
      console.log("assigned Orders fetched successfully:", this.orders);
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

      const response = await postData(
        { orderId: orderId, status: newStatus },
        "courier_update-order-status"
      );

      if (response.ok) {
        const order = this.orders.find((order) => order.order_id === orderId);
        if (order) {
          order.status = newStatus;
        }
      }
    }
  }

  async Accept(orderId: Number) {
    const response = await postData({ orderId }, "accept-assigned-order");
    if (response.ok) {
      const order = this.orders.find((order) => order.order_id === orderId);
      if (order) {
        order.status = "Pending";
      }
    }
  }

  async Decline(orderId: Number) {
    const response = await postData({ orderId }, "decline-assigned-order");
    if (response.ok) {
      const order = this.orders.find((order) => order.order_id === orderId);
      const orderIndex = this.orders.findIndex(
        (order) => order.order_id === orderId
      );
      if (order) {
        order.status = "Placed";
      }
      if (orderIndex !== -1) {
        // Remove the order from the orders array
        this.orders.splice(orderIndex, 1);
      }
    }
  }
}
