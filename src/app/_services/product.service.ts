import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
};

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  APIURL:any="";
  private guid:any;
  private cartQuantity = new BehaviorSubject<number>(0);
  currentQuantity = this.cartQuantity.asObservable();

  
  constructor(private http: HttpClient) {
    this.APIURL = environment.APIUrl;
   }

   createGUid(){
    this.guid = uuidv4();
   }

   getGUID(){
    return this.guid;
   }
   getItemByItemCode(itemCode:any){
    return this.http.get(this.APIURL+"Item/GetItemByItemCode?ItemCode="+itemCode,httpOptions);
   }

   getUnit(){
    return this.http.get(this.APIURL+"Item/GetAllUnit",httpOptions);
   }
  //  updateCartQuantity(quantity: number) {
  //   this.cartQuantity.next(quantity); // Update the cart quantity
  // }
  updateCartQuantity(quantity: number,ItemCode:any,unit:any) {
    if(this.guid == undefined && this.guid == null){
      this.createGUid();
    }
    var currentGuid = this.getGUID();
    this.http.put(this.APIURL+"Item/AddItemInCart?Item_Code="+ItemCode+"&quntity="+quantity+"&refkey="+currentGuid+"&unit="+unit,httpOptions).subscribe((res:any)=>{
      if(res.message.content("Record add")){
        console.log("record added.");
      }
      else{
        console.log("Record not added.");
      }
    });
    let current = this.cartQuantity.value;  // Get current quantity
    const updatedQuantity = current + quantity;  // Increase by the quantity
    console.log('Product added to cart:', updatedQuantity);
    this.cartQuantity.next(updatedQuantity);  // Emit the updated quantity
  }
}
