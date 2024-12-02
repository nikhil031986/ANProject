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
  async ngOnInit() {
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
        this.OrderPaymentDetails = "<h4> Order Id :"+orderId+"</h4>"+
        "<h6> Payment Transaction Id :"+paymentDetails?.transactionId+"</h6>";
      }
    });
  }
  goHome() {
    this.router.navigate(['/home']); // Adjust to your home route
  }
}