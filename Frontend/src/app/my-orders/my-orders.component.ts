import { Component, OnInit } from "@angular/core";
import { getData } from "../api";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-my-orders",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./my-orders.component.html",
  styleUrls: ["./my-orders.component.css"],
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = []; // Initialize orders as an empty array

  constructor(private router: Router) {} // Inject Router in constructor

  async ngOnInit() {
    await this.fetchOrders(); // Fetch orders on component initialization
  }

  async fetchOrders() {
    try {
      const response = await getData("my-orders"); // Fetch data from API
      this.orders = await response.json(); // Store response in orders
      console.log("Orders fetched successfully:", this.orders);
    } catch (error) {
      console.error("Error fetching orders:", error); // Handle errors
    }
  }

  showDetails(order: Order) {
    // const orderString = JSON.stringify(order);
    // localStorage.setItem("order", orderString);
    // this.router.navigate([""]);
    this.router.navigate(["/order-details"], {
      queryParams: { "order-id": order.order_id },
    });
  }
}

export interface Order {
  order_id: number;
  pickup: string;
  dropOff: string;
  details: string;
  deliveryDate: string;
  status: string;
  courier_id: Number;
  user_id: Number;
}
