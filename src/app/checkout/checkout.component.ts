import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartServiceService } from '../_services/cart-service.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialogComponent } from '../address-dialog/address-dialog.component';
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
  imgeUrl:any="";
  customerDetails:any[]=[];
  cartItems:any[]=[];
  customerMaster:any;
  contactDetails:any;
  paymentTerm:any[]=[];
  paymentMethod:any[]=[];
  SystemShipVia:any[]=[];
  customerAddress:any;
  constructor(private fb: FormBuilder,private cart:CartServiceService,private userservice:UserService,
    private token:TokenStorageService,private router: Router,private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.imgeUrl = environment.APIHost;
    this.getCustomerDetails();
    this.getCartData();
    this.initShippingForm();
    this.initBillingForm();
    this.initOrderDetailsForm();
    this.initPaymentForm();
  }

  getCustomerDetails(){
    const currentCustomerId = this.token.getUserInfo("Customer_Id");
    this.userservice.GetCustomerDetails(currentCustomerId).subscribe((res:any)=>{
      this.customerDetails= res;
      if(this.customerDetails != null && this.customerDetails != undefined){
        this.customerMaster = this.customerDetails[0].customerMaster;
        this.customerAddress = this.customerDetails[0].customerLocationInformation;
        this.paymentTerm = this.customerDetails[0].paymentTerm;
        this.paymentMethod = this.customerDetails[0].paymentMethod;
        this.contactDetails = this.customerDetails[0].contactDetails;
        this.SystemShipVia = this.customerDetails[0].systemShipVia;
      }
    });
  }

  getCartData(){
    this.cart.getCart().subscribe((res:any)=>{
      this.cartItems=res;
      console.log(this.cartItems);
    });
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
    this.router.navigate(['/revieworder']);
  }
  

  // openDialog(): void {
  //   this.dialog.open(AddressDialogComponent, {
  //     width: '400px', // Adjust as needed
  //     height: 'auto',
  //   });
  // }
  // openPopup(event: MouseEvent): void {
  //   // Get the button's position
  //   const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
  //   const position = {
  //     top: `${buttonRect.top}px`,
  //     left: `${buttonRect.left}px`
  //   };

  //   this.dialog.open(AddressDialogComponent, {
  //     position: position,
  //     width: '200px', // Set a custom width if needed
  //     height: 'auto'
  //   });
  // }
  // openPopup(event: MouseEvent): void {
  //   // Get the button's position on the screen
  //   const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
  //   const dialogPosition = {
  //     top: `${buttonRect.top + window.scrollY}px`, // Account for scrolling
  //     left: `${buttonRect.left + window.scrollX}px`
  //   };

  //   this.dialog.open(AddressDialogComponent, {
  //     position: dialogPosition,
  //     width: '200px',
  //     height: 'auto'
  //   });
  // }
  openPopup() {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      panelClass: 'custom-dialog-container', // Add a custom class for additional styling
      position: {
        top: '50%', // Adjust as needed
        left: '50%', // Adjust as needed
      },
      // Add width, height or other properties if needed
    });}
  
  }
 
