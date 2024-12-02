import { Component, Inject, NgModule, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
 constructor(private token:TokenStorageService,private productService:ProductService){}
 pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;//Math.ceil(this.data.length / this.pageSize);
 customertranId:any;
 product:any[]=[];
 btntext:any;
 isOpen:boolean=true;
 async ngOnInit(){
  this.btntext="Show Close Orders";
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
    this.btntext="Show Open Orders";
  }
  else{
    this.isOpen=true;
    this.GetCustomerOrderHistory(this.customertranId,"open");
    this.btntext="Show Close Orders";
  }
}

// Paginate the data based on the current page and page size
get paginatedData() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  return this.product.slice(startIndex, startIndex + this.pageSize);
}

// Change page
changePage(page: number) {
  this.currentPage = page;
}

// Calculate total number of pages
get totalPagesCount() {
  return Math.ceil(this.product.length / this.pageSize);
}
 GetCustomerOrderHistory(customerId:any,openTag:any){
  this.productService.GetOrderHistory(customerId,openTag).subscribe((res:any)=>{
    let msg=res.message;
    let jsObj = JSON.parse(msg);
    this.totalPages =  Math.ceil(jsObj.length / this.pageSize);
    console.log(jsObj);
    jsObj.forEach((order:any)=>{
      this.product.push(order);
    });
    // this.product=jsObj;
  })
 }
}
