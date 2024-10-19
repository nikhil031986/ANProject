import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({

 

  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  shippingForm!: FormGroup;
  billingForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initShippingForm();
    this.initBillingForm();
  }



  // Initialize Shipping Form
  initShippingForm() {
    this.shippingForm = this.fb.group({
      shippingName: ['', [Validators.required, Validators.minLength(3)]],
      shippingAddress: ['', [Validators.required, Validators.minLength(5)]],
      shippingCity: ['', [Validators.required, Validators.minLength(2)]],
      shippingZip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]] // Example for US ZIP Code pattern
    });
  }

  // Initialize Billing Form
  initBillingForm() {
    this.billingForm = this.fb.group({
      billingName: ['', [Validators.required, Validators.minLength(3)]],
      billingAddress: ['', [Validators.required, Validators.minLength(5)]],
      billingCity: ['', [Validators.required, Validators.minLength(2)]],
      billingZip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]] // Example for US ZIP Code pattern
    });
  }

  // Handle submission for shipping form
  onSubmitShipping(): void {
    if (this.shippingForm.valid) {
      console.log('Shipping Info:', this.shippingForm.value);
      // Perform actions with the shipping data, like sending to backend
    } else {
      console.log('Shipping form is invalid');
    }
  }

  // Handle submission for billing form
  onSubmitBilling(): void {
    if (this.billingForm.valid) {
      console.log('Billing Info:', this.billingForm.value);
      // Perform actions with the billing data, like sending to backend
    } else {
      console.log('Billing form is invalid');
    }
  }

  // Method to handle proceeding to payment
  onProceedToPayment(): void {
    if (this.shippingForm.valid && this.billingForm.valid) {
      console.log('Proceeding to payment with:');
      console.log('Shipping Info:', this.shippingForm.value);
      console.log('Billing Info:', this.billingForm.value);
      // Navigate to the payment page or execute payment logic here
    } else {
      console.log('Please complete both forms before proceeding');
    }
  }

  // Optional: Getter methods for easy access to form controls in the template (for validation display)
  get shippingControls() {
    return this.shippingForm.controls;
  }

  get billingControls() {
    return this.billingForm.controls;
  }
}