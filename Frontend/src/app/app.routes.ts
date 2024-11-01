import { Routes } from "@angular/router";
import { UserRegistrationComponent } from "./user-registration/user-registration.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component"; // Import the HomeComponent

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
  { path: "**", redirectTo: "" }, // Redirect to home on unknown paths
];
