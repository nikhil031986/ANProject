import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8','XApiKey':'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp' })
};

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  APIURL:any="";

  constructor(private http: HttpClient) {
    this.APIURL = environment.APIUrl;
   }

   getItemByItemCode(itemCode:any){
    return this.http.get(this.APIURL+"Item/GetItemByItemCode?ItemCode="+itemCode,httpOptions);
   }

   removeItemFromWishList(wishlistId:any){
    return this.http.patch(this.APIURL+"AddOn/RemoveFromWishlist?wishlistId="+wishlistId,httpOptions);
   }

   getWishlistDetails(wishlistId:any){
    return this.http.get(this.APIURL+"AddOn/GetWishlistDetails?wishlistId="+wishlistId,httpOptions);
   }

   removeItemFromWishListItem(wishlistItemId:any){
    return this.http.patch(this.APIURL+"AddOn/RemoveFromWishlistItem?wishlistItemId="+wishlistItemId,httpOptions);
   }

   getwishlist(userId:any){
    return this.http.get(this.APIURL+"AddOn/GetWishList?userId="+userId,httpOptions);
   }

   putItemInWishlist(wishlistDetails:any){
    return this.http.post(this.APIURL+"AddOn/AddWishlist",wishlistDetails,httpOptions)
   }

   putWishlistItem(wishlistItem:any){
    return this.http.post(this.APIURL+"AddOn/AddWishListItems",wishlistItem,httpOptions)
   }

   getAllItems(){
    return this.http.get(this.APIURL+"Item/GetAllItems",httpOptions);
   }

   getOrderIdBaseOnOrderNumber(orderNumber:any){
    return this.http.get(this.APIURL+"Order/GetOrderNumber?orderTranId="+orderNumber,httpOptions);
   }

   searchItems(strSearch:any){
    return this.http.get(this.APIURL+"Item/SearchItems?searchData="+strSearch,httpOptions);
   }

   getItemPrice(itemcode:any,qty:any){
    this.http.post(this.APIURL+"Item/GetItemPrice?Itemcode="+itemcode+"&Qty="+qty,httpOptions)
    .subscribe((res:any)=>{
      if(res != undefined && res != null){
        return res.message;
      }else{
        return 0;
      }
    });
   }
   
   getUnit(){
    return this.http.get(this.APIURL+"Item/GetAllUnit",httpOptions);
   }

   PutOrder(order:any){
    return this.http.post(this.APIURL+"Order/SaveOrderDetail",order,httpOptions);
   }
   
   getOrderDetails(orderId:any){
    return this.http.get(this.APIURL+"Order/GetOrderDetail?orderId="+orderId,httpOptions);
   }

   getCurrentUserOrder(customerId:any){
    return this.http.get(this.APIURL+"Order/GetAllOrderDetailByCustomerId?CustomerId="+customerId,httpOptions);
   }

   calculationOfTax(objTax:any){
    return this.http.post(this.APIURL+"Order/CalCulationOfTax",objTax,httpOptions);
   }
   
   orderPayment(objpayment:any){
    return this.http.post(this.APIURL+"Order/PaymentDetail",objpayment,httpOptions);
   }

   orderPutErp(paymentTranId:any,orderId:any){
    return this.http.put(this.APIURL+"Order/OrderPut?paymenttranId="+paymentTranId+"&orderId="+orderId,httpOptions);
   }

   GetOrderHistory(customerId:any,openclose:any){
    return this.http.get(this.APIURL+"Order/GetOrderHistory?customerId="+customerId+"&openclose="+openclose,httpOptions);
   }

   GetShipmentOrder(customerId:any,openclose:any){
    return this.http.get(this.APIURL+"Order/GetShipments?customerId="+customerId+"&openclose="+openclose,httpOptions);
   }

   GetQuotes(customerId:any,openClose:any){
    return this.http.get(this.APIURL+"Order/GetQuotes?customerId="+customerId+"&openclose="+openClose,httpOptions);
   }

   GetOrderInvoice(customerId:any,openclose:any){
    return this.http.get(this.APIURL+"Order/GetOrderInvoice?customerId="+customerId+"&openclose="+openclose,httpOptions);
   }

}
