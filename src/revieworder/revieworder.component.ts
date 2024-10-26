import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-revieworder',
  templateUrl: './revieworder.component.html',
  styleUrl: './revieworder.component.css'
})
export class RevieworderComponent {
  billTo = {
    name: 'John Doe',
    address: '123 Main Street, City, Country',
    phone: '(123) 456-7890',
    fax: '(123) 456-7891'
  };

  shipTo = {
    name: 'Jane Doe',
    address: '456 Oak Street, City, Country',
    phone: '(123) 654-0987',
    fax: '(123) 654-0986'
  };


  orderDetails = {
    cancelDate: '2024-10-21',
    jobRelease: 'Released',
    phone: '(123) 456-7890',
    poNumber: 'PO12345',
    emailAddress: 'customer@example.com',
    paymentType: 'Credit Card',
    shipVia: 'FedEx',
    shippingAccount: '1234567890',
    additionalInfo: 'Leave at front door if no one is home',
    contact: 'John Doe',
    enteredBy: 'Admin'
  };

  products = [
    {
      image: 'https://via.placeholder.com/50',
      name: 'Product 1',
      quantity: 2,
      unitPrice: 25.00,
      total: 50.00
    },
    {
      image: 'https://via.placeholder.com/50',
      name: 'Product 2',
      quantity: 1,
      unitPrice: 100.00,
      total: 100.00
    },
    {
      image: 'https://via.placeholder.com/50',
      name: 'Product 3',
      quantity: 5,
      unitPrice: 10.00,
      total: 50.00
    }
  ];

  agreeTerms = false;
  constructor(private router :Router){
  }

    orderSummary = {
        subtotal: 250.00,
        rebate: 20.00,
        tax: 15.00,
        total: 245.00 // Total calculation can also be dynamic.
    };
    submitOrder() {
      // Code to submit the order
      console.log("Order submitted!");

      this.router.navigate(['/stripepayment'])

  }

  modifyOrder() {
      // Code to modify the order
      console.log("Order modification initiated!");
  }
}
