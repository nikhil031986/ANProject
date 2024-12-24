import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = 'http://localhost:8080/api/test/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8','XApiKey':'pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLogin = new BehaviorSubject<boolean>(false);
  private TOKEN_KEY="userLogin";
  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  setUserLogin(){
    window.sessionStorage.removeItem(this.TOKEN_KEY);
    window.sessionStorage.setItem(this.TOKEN_KEY, "1");
    this.isLogin.next(true);
  }

  setUserLogOff(){
    window.sessionStorage.removeItem(this.TOKEN_KEY);
    this.isLogin.next(false);
  }

  userLogin(){
    var check = window.sessionStorage.getItem(this.TOKEN_KEY);
    if(check != undefined && check != null){
      if(check.includes("1")){
        this.isLogin.next(true);
      }
    }
    return this.isLogin.value;
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
  GetIdFromCategoryName(categeryName:any){
    return this.http.get(environment.APIUrl+"Item/GetIdFromCategoryName?categoryName="+categeryName,httpOptions);
  }
  GetItemByCategory(categoryId:any){
    return this.http.get(environment.APIUrl+"Item/ItemGetByCategory?categoryId="+categoryId,httpOptions);
  }

  GetCustomerDetails(CustId:any){
    return this.http.get(environment.APIUrl+"Customer/GetCustomerDetails?customerId="+CustId,httpOptions);
  }

  GetloginCustomerInfo(CustID: any) {
    return this.http.get(environment.APIUrl + 'Customer/GetCustomerById?customerId='+CustID, httpOptions);
  }

  PutShipmentAddress(addressDetails:any){
    return this.http.post(environment.APIUrl + 'Customer/AddLocation',addressDetails,httpOptions)
  }

  getState(){
    return this.http.get(environment.APIUrl+"User/GetStates",httpOptions);
  }
  getCustomLocation(locationId:any){
    return this.http.get(environment.APIUrl+"CustomerLocation/GetLocationById?locationId="+locationId,httpOptions);
  }
  getCountry(){
    return this.http.get(environment.APIUrl+"User/GetCountry",httpOptions);
  }
}
