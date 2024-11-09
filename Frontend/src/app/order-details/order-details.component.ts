import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Order } from "../my-orders/my-orders.component"; // Adjust the path if necessary
import { ActivatedRoute } from "@angular/router";
import { postData } from "../api";
import { RouterModule } from "@angular/router";
@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.css"],
  imports: [RouterModule],
  standalone: true,
})
export class OrderDetailsComponent implements OnInit {
  order: Order = {
    order_id: 0,
    pickup: "",
    dropOff: "",
    details: "",
    deliveryDate: "",
    status: "",
    courier_id: 0,
    user_id: 0,
  };
  constructor(private router: Router, private route: ActivatedRoute) {}

  async ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get("order-id");
    if (orderId) {
      const response = await postData({ orderId }, "order-details");
      const responseBody = await response.json();

      // Log the full response to inspect its structure
      console.log("Response:", responseBody);

      if (responseBody && Array.isArray(responseBody.order)) {
        // Assign the array values to your order object
        this.order = {
          order_id: responseBody.order[4] ?? 0, // Default to 0 if null or undefined
          pickup: responseBody.order[0] ?? "",
          dropOff: responseBody.order[1] ?? "",
          details: responseBody.order[2] ?? "",
          deliveryDate: responseBody.order[3] ?? "",
          status: responseBody.order[6] ?? "",
          courier_id: responseBody.order[7] ?? 0,
          user_id: responseBody.order[5] ?? 0,
        };

        console.log("Mapped Order:", this.order);
      } else {
        console.warn("Order data is not available.");
      }
    }
  }

  async cancelOrder() {
    try {
      const response = await postData(
        { orderId: this.order.order_id },
        "cancel-order"
      );
      if (response.ok) {
        console.log("Order canceled successfully.");
        this.router.navigate(["/my-orders"]);
      } else {
        console.error("Failed to cancel order.");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  }
}
