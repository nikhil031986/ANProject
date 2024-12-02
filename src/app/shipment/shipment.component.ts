import { Component, Inject, NgModule, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.css'
})
export class ShipmentComponent {
  constructor(private token:TokenStorageService,private productService:ProductService){}
  customertranId:any;
  product:any[]=[];
  btntext:any;
  isOpen:boolean=true;
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
  
   GetCustomerOrderHistory(customerId:any,openTag:any){
    this.productService.GetShipmentOrder(customerId,openTag).subscribe((res:any)=>{
      let msg=res.message;
      let jsObj = JSON.parse(msg);
      console.log(jsObj);
      jsObj.forEach((order:any)=>{
        this.product.push(order);
      });
      // this.product=jsObj;
    })
   }
}
