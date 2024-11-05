import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import * as html2pdf from 'html2pdf.js';

import { ToastrService } from 'ngx-toastr';
import { StripService } from '../_services/strip.service';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';

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
  orderSummary = {
    subtotal: 250.00,
    rebate: 20.00,
    tax: 15.00,
    total: 245.00 // Total calculation can also be dynamic.
};
orderId:any=0;
  myorder:any="";
  constructor(
      private dialogRef: MatDialogRef<PaymentPOPUPComponent>,
      private stripeService: StripService,
      private toaster: ToastrService,
      private  productService: ProductService,
      private router :Router

  ) {}
  

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
    const response = await fetch('http://localhost:3000/create-payment-intent', {
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
        this.router.navigate(['/paymentSuccess']);

        // Optionally, call your payment token function or any additional logic
        this.paymentToken(paymentIntent);
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
    paymentThrow: tvalue.card.brand,
    cardNumber: tvalue.card.last4,
    cvcCheck: String(tvalue.card.cvc_check),
    expMonth: String(tvalue.card.exp_month),
    expYear:  String(tvalue.card.exp_year),
    funding: tvalue.card.funding,
    last4: tvalue.card.last4,
    emailId: tvalue.email,
    clientIp: tvalue.client_ip,
    tokenValue: objstr
  }
  this.CreatePDfFile();
  console.log(objPaymentDetails)
  this.productService.orderPayment(objPaymentDetails).subscribe((res:any)=>{
    if(res != undefined && res != null){
      if(res.message == "Payment succ."){
        this.toaster.success("Payment done.");
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
