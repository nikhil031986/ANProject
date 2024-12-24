import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent{
  constructor(private route: ActivatedRoute,private router: Router,private productservice:ProductService,private toastera:ToasterService,) {}
  myorder:any;
  OrderPaymentDetails:string="";
  lbltext:string="";
  lblOrder:string="";
  async ngOnInit() {
    this.lbltext="Your payment has been processed successfully.";
    this.lblOrder="Payment Successful!";
    this.route.paramMap.subscribe((params) => {
      const orderId = params.get('order');
      this.myorder = orderId;
      this.getOrderDetails(orderId);
    });
  }
  getOrderDetails(orderId:any){
    this.productservice.getOrderDetails(orderId).subscribe((res:any)=>{
      if(res != undefined && res != null){
        let paymentDetails = res[0].paymentDetails;
        let orderDetails = res[0].orderId;
        this.OrderPaymentDetails = "<h4> Order Id :"+orderDetails+"</h4>";
        if(paymentDetails?.transactionId != undefined && paymentDetails?.transactionId != null){
          this.lbltext="Your payment has been processed successfully.";
           this.OrderPaymentDetails =this.OrderPaymentDetails +"<h6> Payment Transaction Id :"+paymentDetails?.transactionId+"</h6>";
        }else{
          this.lblOrder="Order Successful!";
          this.lbltext="Your order has been processed successfully.";
        }
      }
    });
  }
  goHome() {
    this.router.navigate(['/home']); // Adjust to your home route
  }
}