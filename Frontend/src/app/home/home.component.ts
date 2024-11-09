import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-home",
  standalone: true,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  username: string | null = null;

  ngOnInit(): void {
    this.username = localStorage.getItem("username");
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }

  goToRegister() {
    this.router.navigate(["/register"]);
  }

  goToCreateOrder() {
    this.router.navigate(["/create-order"]);
  }

  goToMyOrders() {
    this.router.navigate(["/my-orders"]);
  }

  goToMyMangeOrders() {
    this.router.navigate(["/manage-all-orders"]);
  }
  goToAssignedOrders() {
    this.router.navigate(["/assigned-orders"]);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.username = null;
    this.router.navigate(["/"]);
  }

  isAdmin() {
    return localStorage.getItem("role") === "admin";
  }

  isCourier() {
    return localStorage.getItem("role") === "courier";
  }

  isCustomer() {
    return localStorage.getItem("role") === "customer";
  }
}
