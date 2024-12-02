import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartServiceService } from 'src/app/_services/cart-service.service';
import { ProductService } from 'src/app/_services/product.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';
import * as html2pdf from 'html2pdf.js';
import { ActiveToast } from 'ngx-toastr';
import { Stripe, StripeCardElement } from '@stripe/stripe-js'
import { StripService } from 'src/app/_services/strip.service';
import { PaymentPOPUPComponent } from 'src/app/payment-popup/payment-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-revieworder',
  templateUrl: './revieworder.component.html',
  styleUrl: './revieworder.component.css'
})
export class RevieworderComponent {
  handler:any = null;
  objproduct:any[]=[];
  objTaxt:any;
  orderId:any=0;
  myorder:any="";
  stobj: Stripe | null=null;
  card: StripeCardElement | null=null;
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

  products:any[] = [];

  agreeTerms = false;

    orderSummary = {
        subtotal: 250.00,
        rebate: 20.00,
        tax: 15.00,
        total: 245.00 // Total calculation can also be dynamic.
    };
    imagePath:any;
    
    constructor(private route: ActivatedRoute,private cart:CartServiceService,private userservice:UserService,
      private token:TokenStorageService,private router: Router,
      private productservice:ProductService,private toastera:ToasterService,private stservice:StripService,private dialog: MatDialog){}

     async ngOnInit() {
        this.imagePath=environment.APIHost;
        this.route.paramMap.subscribe((params) => {
          const orderId = params.get('order');
          this.myorder = orderId;
          this.getOrderDetails(orderId);
        });
        this.stobj = await this.stservice.getStripeInstance();

        if (!this.stobj) {
          console.error('Stripe has not been initialized');
          return;
        }
    
        // Create Elements instance and card element only if stripe is initialized
        const elements = this.stobj.elements();
        this.card = elements.create('card');
        this.card.mount('#card-element');
      }
      getOrderDetails(orderId:any){
        this.productservice.getOrderDetails(orderId).subscribe((res:any)=>{
          console.log(res);
          if(res != undefined && res != null){
            this.orderId = res[0].id;
            const productDetails = res[0].orderDetails;
            var subTotal =0;
            this.products=[];
            let TaxRate=0;
            let TaxAmount=0;
            productDetails.forEach((element:any) => {
              this.products.push({
                image: String(this.imagePath)+String(element.imgPath),
                name: String(element.itemCode)+" "+String(element.itemDesc),
                quantity: element.qty,
                unitPrice: element.itemPrice,
                amount: Number(element.amount),
                taxrate:Number(element.taxrate),
                taxamount:Number(element.taxamount),
                netamount:Number(element.netamount)
              });
              subTotal= subTotal+(Number(element.amount));
              TaxRate = TaxRate+Number(element.taxrate);
              TaxAmount = TaxAmount+Number(element.taxamount);
            });
            this.orderSummary.rebate=0.0;
            this.orderSummary.subtotal = Number(subTotal);
            this.orderSummary.tax = Number(TaxAmount);
            this.orderSummary.total = (Number(subTotal) + Number(TaxAmount)) -  Number(this.orderSummary.rebate);

            this.getCustomerDetails(res[0].customerId);
            const dtOrder = res[0].orderDate.substr(0,10);
            this.orderDetails.cancelDate = dtOrder;
            this.orderDetails.additionalInfo="Leave at front door if no one is home";
            this.orderDetails.phone=res[0].customer.phone;
            this.orderDetails.emailAddress= res[0].customer.email;
            this.orderDetails.contact = res[0].customer.firstName;
            this.orderSummary.rebate =0;
          }
        });
      }
      
      getCustomerDetails(customerId:any){
        this.userservice.GetCustomerDetails(customerId).subscribe((res:any)=>{
          if(res != undefined && res != null){
            const addressDetails = res[0].shipingLocation[0];
            const shipviaaddress = res[0].shipAddresses[0];
              this.objTaxt={
                from_country:addressDetails.country,
                from_zip:"73001",
                from_state:addressDetails.state,
                from_city:addressDetails.city,
                to_country:shipviaaddress.country,
                to_zip:shipviaaddress.postal,
                to_state:shipviaaddress.state,
                to_city:shipviaaddress.city,
                amount:this.orderSummary.total,
                shipping:"0.1",
                line_items:this.objproduct
              };
              this.billTo.name=res[0].customerMaster.firstName;
              const address= addressDetails.address1
              +" "+addressDetails.address2+" ,"+addressDetails.address3+" , "
              + addressDetails.city+" ,"+addressDetails.country+","
              +addressDetails.state;
              this.billTo.address = address;
              this.billTo.phone = addressDetails.phone;
              this.billTo.fax="";
              this.shipTo.address=shipviaaddress.address1
              +" "+shipviaaddress.address2+" ,"+shipviaaddress.address3+" , "
              + shipviaaddress.city+" ,"+shipviaaddress.country+","
              +shipviaaddress.state;
              this.shipTo.name = shipviaaddress.name;
              this.shipTo.phone = shipviaaddress.phone;
              this.shipTo.fax="";
          }
        });
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
    submitOrder() {

      
      // // Code to submit the order
      // var handler = (<any>window).StripeCheckout.configure({
      //   key: environment.stripKey,
      //   locale: 'auto',
      //   token: (token: any)=> {
      //     // You can access the token ID with `token.id`.
      //     // Get the token ID to your server-side code for use.
      //     this.paymentToken(token);
      //   }
      // });
      // handler.open({
      //   name: 'Stripe Payment',
      //   description: '2 widgets',
      //   amount: this.orderSummary.total * 100
      // });
      this.toastera.success("Payment Process");
      console.log("Order submitted!");
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
    this.productservice.orderPayment(objPaymentDetails).subscribe((res:any)=>{
      if(res != undefined && res != null){
        if(res.message == "Payment succ."){
          this.toastera.success("Payment done.");
          this.toastera.success('Payment done.', 'Order status').finally(()=>{
            this.productservice.orderPutErp(objPaymentDetails.tokenValue,objPaymentDetails.orderId).subscribe((res:any)=>{
              window.location.href="/allOrder";
            });
          });
        }else{
          this.toastera.error(res.message);
        }

      }
    })
  }

  // async handlePayment() {
  //   if (!this.stobj || !this.card) {
  //     console.log('Stripe.js has not loaded or card element not set up');
  //     return;
  //   }

  //   // Call your backend to create a Payment Intent and get the client secret
  //   const response = await fetch('http://localhost:3000/create-payment-intent', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ amount: this.orderSummary.subtotal }) // example amount in cents ($50)
  //   });
  //   const { clientSecret } = await response.json();

  //   // Confirm the payment with the client secret
  //   const { paymentIntent, error } = await this.stobj.confirmCardPayment(clientSecret, {
  //     payment_method: {
  //       card: this.card,
  //       billing_details: {
  //         name: 'Sample',
  //       },
  //     },
  //   });

  //   if (error) {
  //     console.error('Payment failed:', error);
  //   } else if (paymentIntent && paymentIntent.status === 'succeeded') {
  //     console.log('Payment successful!');
  //     // Handle post-payment actions here
  //   }
  // }

  // loadStripe() {

  //   this.stobj = await this.stservice.getStripeInstance();
  //   if (this.stobj) {
  //     // Set up Stripe Elements
  //     const elements = this.stobj.elements();
  //     this.card = elements.create('card');
  //     this.card.mount('#card-element');
  //   }
  // }


  async handlePayment() {
    const stripe = await this.stservice.getStripeInstance();
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
        this.toastera.error('Payment failed: ' + error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful!');
        this.toastera.success('Payment successful!');
        // Optionally, call your payment token function or any additional logic
        this.paymentToken(paymentIntent);
    }
}

  modifyOrder() {
      // Code to modify the order
      console.log("Order modification initiated!");
  }

  openPaymentModal(){
    var orderDetails = {
      orderId:this.orderId,
      subtotal: this.orderSummary.subtotal,
      rebate: this.orderSummary.rebate,
      tax: this.orderSummary.tax,
      total: this.orderSummary.total
    }
    const dialogRef = this.dialog.open(PaymentPOPUPComponent, {
      width: '600px',
      data:{value:orderDetails},
  });
  }
}
