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
  orderDetailsForm!:FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initShippingForm();
    this.initBillingForm();
    this.initOrderDetailsForm();
  }



  // Initialize Shipping Form
  initShippingForm() {
    this.shippingForm = this.fb.group({
      sameAsBilling: [false], // Checkbox, no validators required
      residential: [false],   // Checkbox, no validators required
      shippingToName: ['', [Validators.required, Validators.minLength(3)]],
      blindShopping: [false], // Checkbox, no validators required
      attn: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10 digit phone number validation
      address: ['', [Validators.required, Validators.minLength(5)]],
      billingAddress1: ['', [Validators.required, Validators.minLength(5)]],
      billingAddress2: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]] // 5 digit postal code
    });
  }


  // Initialize Billing Form
  initBillingForm() {
    this.billingForm = this.fb.group({
      billingName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3)]],
      fax:['', [Validators.required, Validators.minLength(3)]],
      address:['', [Validators.required, Validators.minLength(3)]],
      billingAddress1:['', [Validators.required, Validators.minLength(3)]],
      billingAddress2:['', [Validators.required, Validators.minLength(3)]],
      state:['', [Validators.required, Validators.minLength(3)]],
       City: ['', [Validators.required, Validators.minLength(2)]],
    postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]] // Example for US ZIP Code pattern
    });
  }

  initOrderDetailsForm() {
    this.orderDetailsForm = this.fb.group({
      cancelDate: ['', Validators.required],
      jobRelease: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      poNumber: ['', Validators.required],
      contact: ['', Validators.required],
      enteredBy: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      paymentType: ['', Validators.required],
      shipVia: ['', Validators.required],
      shippingAccount: ['', Validators.required],
      additionalInfo: ['']
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
  onSubmitOrderDetails(){
    
  }
}