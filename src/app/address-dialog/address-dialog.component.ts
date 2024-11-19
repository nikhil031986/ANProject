import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder ,FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { ToasterService } from '../services/toaster.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-address-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatSelectModule, MatInputModule, MatDialogModule,ScrollingModule], // Import FormsModule to use ngModel
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.css']
})
export class AddressDialogComponent  implements OnInit{
  NewAddressForm!:FormGroup;
  lstContry:any;
  lstState:any;
  customerTranId:any;
  constructor(private dialogRef: MatDialogRef<AddressDialogComponent>, private fb: FormBuilder,
    private token:TokenStorageService,private userservice:UserService,private toastera:ToasterService) {
      this.CreateFormGroup();
    }
    
  ngOnInit(): void {
    this.getState();
    this.getCountry();
  }

  CreateFormGroup(){
    this.NewAddressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postcode: ['', Validators.required],
      phonenumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
  
  getState(){
    this.userservice.getState().subscribe((res:any)=>{
      this.lstState=res;
      console.log(res);
    });
  }

  getCountry(){
    this.userservice.getCountry().subscribe((res:any)=>{
      this.lstContry=res;
      console.log(res);
    });
  }

  onAddressChange(event:any){
    this.NewAddressForm.get("country")?.setValue(event.target.value);
  }

  onSubmit(): void {
    this.customerTranId = this.token.getUserInfo("CustomerTranId");
    const addressData ={
      custId: String(this.customerTranId) ,
      address1: this.NewAddressForm.get("addressLine1")?.value,
      address2: this.NewAddressForm.get("addressLine2")?.value,
      city: this.NewAddressForm.get("city")?.value,
      state: this.NewAddressForm.get("state")?.value,
      postalCode: this.NewAddressForm.get("postcode")?.value,
      country: this.NewAddressForm.get("country")?.value,
      phone: this.NewAddressForm.get("phonenumber")?.value
    };
    console.log(addressData);
    this.userservice.PutShipmentAddress(addressData).subscribe((res:any)=>{
      var msg = res.message;
      if(res.success){
        this.toastera.error(msg);
      }
      else{
        this.toastera.success(msg);
      }
    });
    this.dialogRef.close(addressData);
  }
}