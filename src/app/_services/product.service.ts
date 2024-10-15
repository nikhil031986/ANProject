import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
};

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  APIURL:any="";

  private cartQuantity = new BehaviorSubject<number>(0);
  currentQuantity = this.cartQuantity.asObservable();

  constructor(private http: HttpClient) {
    this.APIURL = environment.APIUrl;
   }

   getItemByItemCode(itemCode:any){
    return this.http.get(this.APIURL+"Item/GetItemByItemCode?ItemCode="+itemCode,httpOptions);
   }

  //  updateCartQuantity(quantity: number) {
  //   this.cartQuantity.next(quantity); // Update the cart quantity
  // }
  updateCartQuantity(quantity: number) {
    let current = this.cartQuantity.value;  // Get current quantity
    const updatedQuantity = current + quantity;  // Increase by the quantity
    console.log('Product added to cart:', updatedQuantity);
    this.cartQuantity.next(updatedQuantity);  // Emit the updated quantity
  }
}
