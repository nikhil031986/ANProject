import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { ProductService } from '../_services/product.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-create-and-update-address',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormsModule],
  templateUrl: './create-and-update-address.component.html',
  styleUrl: './create-and-update-address.component.css'
})

export class CreateAndUpdateAddressComponent implements OnInit  {
  location:any;
  selectedLocation:any;
  AddressForm!:FormGroup;
  currentCuterTranId:any;
  lststate:any;
  lstContry:any;
  locationTranId:any="0";
  constructor(private fb: FormBuilder,private token:TokenStorageService,private userservice:UserService
    ,private product:ProductService,private toastera:ToasterService,private route: ActivatedRoute){
    this.CreateFromGroup();
  }

  ngOnInit():void{
    this.route.paramMap.subscribe((params) => {
      const orderId = params.get('location');
      this.location = orderId;
    });
    this.getState();
    this.getCountry();
    this.getLocationAddress();
  }
  
  getLocationAddress(){
    if(this.location != undefined || this.location != null || this.location != "0"){
      this.userservice.getCustomLocation(this.location).subscribe((res:any)=>{
        this.selectedLocation = res;
        if(this.selectedLocation != undefined || this.selectedLocation != null){

          this.AddressForm.get("addressLine1")?.setValue(this.selectedLocation.address1);
          this.AddressForm.get("addressLine2")?.setValue(this.selectedLocation.address2);
          this.AddressForm.get("city")?.setValue(this.selectedLocation.city);
          this.AddressForm.get("state")?.setValue(this.selectedLocation.state);
          this.AddressForm.get("postcode")?.setValue(this.selectedLocation.postal);
          this.AddressForm.get("country")?.setValue(this.selectedLocation.country);
          this.AddressForm.get("phonenumber")?.setValue(this.selectedLocation.phone);
          this.locationTranId = String(this.selectedLocation.customerLocationTranId);
        }
      });
    }
  }

  getState(){
    this.userservice.getState().subscribe((res:any)=>{
      this.lststate=res;
      console.log(res);
    });
  }

  getCountry(){
    this.userservice.getCountry().subscribe((res:any)=>{
      this.lstContry=res;
      console.log(res);
    });
  }

  CreateFromGroup(){
    this.AddressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postcode: ['', Validators.required],
      phonenumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  onChangeState(event:any){
    this.AddressForm.get("state")?.setValue(event.target.value);
  }

  onCountryChange(event:any){
    this.AddressForm.get("country")?.setValue(event.target.value);
  }

  onSubmitShipping(){
    this.currentCuterTranId = this.token.getUserInfo("CustomerTranId");
    const addressData ={
      custId: String(this.currentCuterTranId) ,
      address1: this.AddressForm.get("addressLine1")?.value,
      address2: this.AddressForm.get("addressLine2")?.value,
      city: this.AddressForm.get("city")?.value,
      state: this.AddressForm.get("state")?.value,
      postalCode: this.AddressForm.get("postcode")?.value,
      country: this.AddressForm.get("country")?.value,
      phone: this.AddressForm.get("phonenumber")?.value,
      locationTranId:this.locationTranId
    };
    this.userservice.PutShipmentAddress(addressData).subscribe((res:any)=>{
      var msg = res.message;
      if(res.success){
        this.toastera.error(msg);
      }
      else{
        this.toastera.success(msg);
        window.location.href="checkOut";
      }
    });
  }
}
