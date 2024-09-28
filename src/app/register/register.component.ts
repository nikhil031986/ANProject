import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

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
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { FirstName,LastName,phoneNumber, email, password } = this.form;
    var UserDetails:any={};
    UserDetails.FirstName=FirstName;
    UserDetails.LastName=LastName;
    UserDetails.Phone=phoneNumber;
    UserDetails.emailId=email;
    UserDetails.password=password;
    this.authService.register(UserDetails).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
