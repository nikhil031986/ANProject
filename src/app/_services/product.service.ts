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

  constructor(private http: HttpClient) {
    this.APIURL = environment.APIUrl;
   }

   getItemByItemCode(itemCode:any){
    return this.http.get(this.APIURL+"Item/GetItemByItemCode?ItemCode="+itemCode,httpOptions);
   }

   getUnit(){
    return this.http.get(this.APIURL+"Item/GetAllUnit",httpOptions);
   }

}
