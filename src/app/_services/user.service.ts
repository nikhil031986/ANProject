import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = 'http://localhost:8080/api/test/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }

  CheckEmail(email:any){
    return this.http.get(environment.APIUrl+"User/CheckEmaiId?emailId="+email,httpOptions);
  }

  GetMenuItem(){
    return this.http.get(environment.APIUrl+"Item/GetItemCategory",httpOptions);
  }
  
  GetCategoryWithNoItem(){
    return this.http.get(environment.APIUrl+"Item/GetItetmWiseCategory",httpOptions);
  }

  GetItemByCategory(categoryId:any){
    return this.http.get(environment.APIUrl+"Item/ItemGetByCategory?categoryId="+categoryId,httpOptions);
  }

  GetloginCustomerInfo(CustID: any) {
    return this.http.get(environment.APIUrl + 'Customer/GetCustomerById?customerId='+CustID, httpOptions);}
}
