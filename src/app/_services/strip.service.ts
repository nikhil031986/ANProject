import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    // Load Stripe asynchronously and set the publishable key
    this.stripePromise = loadStripe(environment.stripKey); // Replace with your Stripe publishable key
  }

  // Expose the initialized Stripe instance
  getStripeInstance(): Promise<Stripe | null> {
    return this.stripePromise;
  }
}
