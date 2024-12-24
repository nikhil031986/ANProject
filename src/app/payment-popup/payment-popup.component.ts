import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import * as html2pdf from 'html2pdf.js';

import { ToastrService } from 'ngx-toastr';
import { StripService } from '../_services/strip.service';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-popup',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatDialogModule, NgIf],
  templateUrl: './payment-popup.component.html',
  styleUrl: './payment-popup.component.css'
})
export class PaymentPOPUPComponent implements OnInit {
  card: any; // Stripe card element
  isSubmitting = false;
  orderId:any;
  orderSummary = {
    subtotal: 250.00,
    rebate: 20.00,
    tax: 15.00,
    total: 245.00 // Total calculation can also be dynamic.
};
myorder:any="";
constructor(
    @Inject(MAT_DIALOG_DATA) public orderDetails: { value: any },
      private dialogRef: MatDialogRef<PaymentPOPUPComponent>,
      private stripeService: StripService,
      private toaster: ToastrService,
      private  productService: ProductService,
      private router :Router

  ) {
    this.orderId = orderDetails.value.orderId;
    this.orderSummary.subtotal = orderDetails.value.subtotal;
    this.orderSummary.rebate = orderDetails.value.rebate;
    this.orderSummary.tax = orderDetails.value.tax;
    this.orderSummary.total = orderDetails.value.total;
    console.log(orderDetails.value);
  }
  
  
  ngOnInit(): void {
    this.initializeStripe();
  }

  

  async initializeStripe() {
      const stripe = await this.stripeService.getStripeInstance();
      if (!stripe) {
          console.log('Stripe.js has not loaded');
          return;
      }
      
      // Create an instance of the card element
      this.card = stripe.elements().create('card');
      this.card.mount('#card-element');

      // Handle real-time validation errors from the card element
      this.card.on('change', (event: any) => {
          const displayError = document.getElementById('card-errors');
          if (event.error) {
              displayError!.innerText = event.error.message;
          } else {
              displayError!.innerText = '';
          }
      });
  }

  async handlePayment() {
    const stripe = await this.stripeService.getStripeInstance();
    if (!stripe || !this.card) {
        console.log('Stripe.js has not loaded or card element not set up');
        return;
    }

    // Call your backend to create a Payment Intent and get the client secret
    const response = await fetch(environment.APIUrl+"Order/create-payment-intent", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: this.orderSummary.subtotal }) // Amount in cents
    });

    if (!response.ok) {
        console.error('Failed to create payment intent:', response.statusText);
        return;
    }

    const { clientSecret } = await response.json();

    // Confirm the payment with the client secret
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: this.card,
            billing_details: {
                name: 'Sample', // Change to actual user name or data
            },
        },
    });

    if (error) {
        console.error('Payment failed:', error.message);
        this.toaster.error('Payment failed: ' + error.message);
        this.onCancel();
        this.router.navigate(['/paymentFailed']);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {

        console.log('Payment successful!');
        this.toaster.success('Payment successful!');
        this.onCancel();
        this.paymentToken(paymentIntent);
        

        // Optionally, call your payment token function or any additional logic
    }
}

CreatePDfFile(){
  const element = document.getElementById('content-to-print');

  // Set PDF options
  const options = {
    margin:       1,
    filename:     this.myorder+'.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'L' }
  };

  // Generate PDF
  html2pdf().from(element).set(options).save();
}
paymentToken(token:any){
  console.log(token);
  const tvalue = token;
  let objstr = JSON.stringify(token);
  var objPaymentDetails={
    id: 0,
    orderId: this.orderId,
    amount: this.orderSummary.total,
    paymentThrow: tvalue.payment_method_types[0],
    cardNumber: tvalue.payment_method,
    cvcCheck: String(tvalue.client_secret),
    expMonth: String("02"),
    expYear:  String("2026"),
    funding: tvalue.confirmation_method,
    last4: "",
    emailId: tvalue.id,
    clientIp: "",
    tokenValue: objstr
  }
  this.CreatePDfFile();
  console.log(objPaymentDetails)
  this.productService.orderPayment(objPaymentDetails).subscribe((res:any)=>{
    if(res != undefined && res != null){
      if(res.message == "Payment succ."){
        this.productService.orderPutErp(objPaymentDetails.tokenValue,this.orderId).subscribe((msg:any)=>{
          this.toaster.success("Payment done.");
          this.router.navigate(['/paymentSuccess',this.orderId]);
        });
        //this.toaster.success('Payment done.', 'Order status').finally(()=>{
         // window.location.href="/allOrder";
       // });
      }else{
        this.toaster.error(res.message);
      }

    }
  })
}
   onCancel() {
      this.dialogRef.close(); // Close the dialog on cancel
  }
}
