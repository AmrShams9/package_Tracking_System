import { Routes } from "@angular/router";
import { AuthGuard } from "./app.guard";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { ManageOrdersComponent } from "./manage-orders/manage-orders.component";
import { AssignedOrdersComponent } from "./assigned-orders/assigned-orders.component";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./home/home.component").then((m) => m.HomeComponent), // Set HomeComponent as the default route
  },
  {
    path: "register",
    loadComponent: () =>
      import("./user-registration/user-registration.component").then(
        (m) => m.UserRegistrationComponent
      ),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "create-order",
    loadComponent: () =>
      import("./create-order/create-order.component").then(
        (m) => m.CreateOrderComponent
      ),
    canActivate: [AuthGuard],
    data: { role: ["customer", "admin"] },
  },
  {
    path: "my-orders",
    loadComponent: () =>
      import("./my-orders/my-orders.component").then(
        (m) => m.MyOrdersComponent
      ),
    canActivate: [AuthGuard],
    data: { role: ["customer", "admin"] },
  },
  {
    path: "order-details",
    component: OrderDetailsComponent,
    canActivate: [AuthGuard],
    data: { role: ["customer", "admin"] },
  },
  {
    path: "manage-all-orders",
    component: ManageOrdersComponent,
    canActivate: [AuthGuard],
    data: { role: ["admin"] },
  },
  {
    path: "assigned-orders",
    component: AssignedOrdersComponent,
    canActivate: [AuthGuard],
    data: { role: ["admin", "courier"] },
  },
  { path: "**", redirectTo: "" }, // Redirect to home on unknown paths
];
