import { Component } from '@angular/core'; 
import { Router } from '@angular/router';
//import logo from 'Frontend\src\app\assets\logo.png';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ["./home.component.css"]
})
export class HomeComponent {
  constructor(private router: Router) {}
  //logo = logo;

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
