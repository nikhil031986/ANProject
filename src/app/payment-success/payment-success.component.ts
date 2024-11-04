import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent{
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']); // Adjust to your home route
  }
}