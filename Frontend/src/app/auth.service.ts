import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";

import { postData } from "./api";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<any> {
    const response = await postData({ email, password }, "login");
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    }
  }

  storeToken(token: string): void {
    const decodedToken: any = jwtDecode(token);
    localStorage.setItem("id", decodedToken.sub["id"]);
    localStorage.setItem("username", decodedToken.sub["username"]);
    localStorage.setItem("role", decodedToken.sub["role"]);
    localStorage.setItem("access_token", token); // Store the token in local storage
  }

  getToken(): string | null {
    return localStorage.getItem("access_token"); // Retrieve the token
  }

  logout(): void {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null; // Check if the user is logged in
  }

  // You can create an interceptor to add the token to each request if needed
  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`, // Attach the token to the headers
    });
  }
}
