import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({

 

  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule], // Make sure CommonModule is imported
  providers: [CurrencyPipe],
 // imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  shippingForm!: FormGroup;
  billingForm!: FormGroup;
  orderDetailsForm!:FormGroup;
  paymentForm!: FormGroup;

  cartItems = [
    {
      imageUrl: 'https://via.placeholder.com/50',
      name: 'Product 1',
      quantity: 1,
      unitPrice: 10.0,
      totalPrice: 10.0
    },
    {
      imageUrl: 'https://via.placeholder.com/50',
      name: 'Product 2',
      quantity: 2,
      unitPrice: 20.0,
      totalPrice: 40.0
    }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initShippingForm();
    this.initBillingForm();
    this.initOrderDetailsForm();
    this.initPaymentForm();
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

  initPaymentForm() {
    this.paymentForm = this.fb.group({
      cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
      cardType: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]], // 16 digits for a credit card
      securityCode: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]], // 3-4 digits for CVV
      expirationMonth: ['', [Validators.required]],
      expirationYear: ['', [Validators.required]],
      address1: ['', [Validators.required, Validators.minLength(5)]],
      address2: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      email: ['', [Validators.required, Validators.email]]
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

  onSubmitPayment(){

  }





  // Function to remove item from the cart
  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }

  // Function to update total price based on quantity
  updateTotalPrice(index: number): void {
    const item = this.cartItems[index];
    item.totalPrice = item.quantity * item.unitPrice;
  }
  onClickContinue(){
    
  }
}