import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  standalone: true,
  imports: [],
  templateUrl: './payment-failed.component.html',
  styleUrl: './payment-failed.component.css'
})
export class PaymentFailedComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/home']);  // Navigate to the home page
  }}
