import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { state } from '@angular/animations';
import { ToasterService } from '../services/toaster.service';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    FirstName:null,
    LastName :null,
    email: null,
    phoneNumber:null,
    password: null,
    iscustomer: [false],
    customerid:[0],
    State:null,
    City:null,
    Contry:null,
    postalCode:null,
    ConfirmPassword:null,
    comapnyName:null,
    Address1:null,
    Address2:null,
  };
  isvalidateemail:boolean=true;
  hide1:boolean = true;
  isShowMsg: boolean = true;
  returnmsg: string="";
  isShowMsg1:boolean=false;
  confirmPass:boolean = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  iscustomeridValidation: boolean = false;
  RegistrationLable:any;
  lststate:any;
  lstContry:any;

  constructor(private authService: AuthService,private userservice : UserService,private toastera:ToasterService) { }

  ngOnInit(): void {
    this.RegistrationLable="Account Registration";
    this.getState();
    this.getCountry();
  }
  getState() {
    this.userservice.getState().subscribe((res:any)=>{
      this.lststate=res;
      console.log(res);
    });
  }
  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];

      if (confirmPassControl.errors && !confirmPassControl.errors['passwordMismatch']) {
        return; // Return if another validator has already found an error
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }
  getCountry(){
    this.userservice.getCountry().subscribe((res:any)=>{
      this.lstContry=res;
      console.log(res);
    });
  }
  onCountryChange(event:any){
    console.log('Selected Option:', event.target.value);
    this.form.Contry = event.target.value;
  }
  onOptionSelected(event: any) {
    console.log('Selected Option:', event.target.value);
    this.form.State = event.target.value;
  }
  checkcustomer(){
    if (this.form.customerid != undefined && this.form.customerid != null && this.form.customerid != '') {
      this.userservice.GetloginCustomerInfo(this.form.customerid).subscribe((res: any) => {
        if (res != undefined && res != null) {
          this.form.FirstName=res.firstName;
          this.form.LastName=res.lastName;
          this.form.email=res.email;
          this.form.phoneNumber=res.phone;
          this.iscustomeridValidation = true;
        }
        else
        {
          this.form.customerid = 0;
          this.iscustomeridValidation = false;
          alert('Customer Account Inactive!  Please contact the Customer Account Specialists at 1-800-448-0406 option 4.')
        }
      });
    }
  }
 
  checkemail(emailId:any):void{
    this.userservice.CheckEmail(emailId).subscribe((res:any)=>{
      if(res.message=="false")
      {
        this.isvalidateemail = false;
        this.toastera.error("Emailid alrday exists.");
      }
      else {
        this.isvalidateemail = true;
        this.toastera.success("Emailid valid.");
      }
    });
  }

  formValidation(){
    var password = this.form.password;
    var confPassword = this.form.ConfirmPassword;

    if(this.form.FirstName === undefined || this.form.FirstName === null){
      this.toastera.info("First name not null.");
      return false;
    }

    if(this.form.LastName === undefined || this.form.LastName === null){
      this.toastera.info("Last name not null.");
      return false;
    }

    if(this.form.email === undefined || this.form.email === null){
      this.toastera.info("emailId not null.");
      return false;
    }

    if(this.isvalidateemail==false)
    {
      this.toastera.error("Emailid alrday exists.");
      return false;
    }

    if(this.form.State === undefined || this.form.State === null){
      this.toastera.info("Please select State from the list.");
      return false;
    }

    if(this.form.Contry === undefined || this.form.Contry === null){
      this.toastera.info("Please select country from the list.");
      return false;
    }

    if(this.form.postalCode === undefined || this.form.postalCode === null){
      this.toastera.info("Postal code not null.");
      return false;
    }

    if(String(password).length < 6){
      this.toastera.info("Password length mustbe grater then six.");
      return false;
    }

    if(password != confPassword){
      this.toastera.info("password and conform password not match.");
      return false;
    }

    if(this.form.Address1 === undefined || this.form.Address1 === null || String(this.form.Address1).length < 1){
      this.toastera.info("Please enter address..")
      return false;
    }

    if(this.form.Address2 === undefined || this.form.Address2 === null || String(this.form.Address2).length < 1){
      this.form.Address2=" ";
    }
    return true;
  }

  onSubmit(): void {
    if(this.isvalidateemail === false){
      this.toastera.error("Please check emailid.");
      return;
    }
    if(!this.formValidation()){
      return;
    }

    const { FirstName,
      LastName,
      email,
      phoneNumber,
      password,
      iscustomer,
      customerid,
      State,
      City,
      Contry,
      postalCode,
      ConfirmPassword,
      comapnyName,
      Address1,
      Address2,
     } = this.form;
    var UserDetails:any={};
    UserDetails.FirstName=FirstName;
    UserDetails.LastName=LastName;
    UserDetails.Phone=phoneNumber;
    UserDetails.emailId=email;
    UserDetails.password=password;
    UserDetails.companyName= comapnyName;
    UserDetails.Address1 = Address1;
    UserDetails.Address2=Address2;
    UserDetails.City=City;
    UserDetails.Country=Contry;
    UserDetails.state = State;
    UserDetails.zipCode = postalCode;
    this.authService.register(UserDetails).subscribe({
      next: data => {
        console.log(data);
        if(data.message == "EmailId already exists into the system."){
            alert(data.message);
            this.isSuccessful = false;
            this.isSignUpFailed = true;
          }
        else{
          this.toastera.success("User register.");
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          window.location.href="login";
        }
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
