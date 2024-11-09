// src/app/auth.guard.ts

import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRole = route.data["role"] as any | null;

    const userRole = localStorage.getItem("role");

    if (this.authService.isLoggedIn() && requiredRole.includes(userRole)) {
      return true; // Allow access
    } else {
      this.router.navigate(["/login"]); // Redirect to login if not authenticated
      return false; // Prevent access
    }
  }
}
