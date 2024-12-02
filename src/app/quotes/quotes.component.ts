import { Component, Inject, NgModule, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css'
})
export class QuotesComponent {
  customertranId:any;
  product:any[]=[];
  btntext:any;
  isOpen:boolean=true;
  constructor(private token:TokenStorageService,private productService:ProductService){}
  
  async ngOnInit(){
    this.btntext="Show Close Shipments";
    let IsUserLogin= this.token.userLogin();
        if(!IsUserLogin){
          window.location.href="/home";
        }
      let custTranId = this.token.getUserInfo("CustomerTranId");
      this.customertranId=custTranId;
      let openClose="open";
      this.GetCustomerOrderHistory(custTranId,openClose);
   }

   GetCustomerOrderHistory(customerId:any,openClose:any){
    this.productService.GetQuotes(customerId,openClose).subscribe((res:any)=>{
      let msg=res.message;
      let jsObj = JSON.parse(msg);
      console.log(jsObj);
      jsObj.forEach((order:any)=>{
        this.product.push(order);
      });
    });
   }

   btnOpenClose(){
    this.product=[];
    if(this.isOpen){
      this.isOpen=false;
      this.GetCustomerOrderHistory(this.customertranId,"close");
      this.btntext="Show Open Shipments";
    }
    else{
      this.isOpen=true;
      this.GetCustomerOrderHistory(this.customertranId,"open");
      this.btntext="Show Close Shipments";
    }
   }
}
