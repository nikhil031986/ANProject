import { Component, isStandalone, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { CartServiceService } from '../_services/cart-service.service';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isForgotPassword:boolean=false;
  UserID: string | undefined;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  captcha1: string | undefined;
  Errormsg: string | undefined;
  isError: boolean = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
    private router: Router,private cart:CartServiceService,private user:UserService,private tostar : ToastrService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.isForgotPassword=false;
  }

  IsUserLogin(){
    return this.user.userLogin();
  }

  forgetPassword(){
    this.isForgotPassword=false;
    this.authService.forgetPassword(this.UserID).subscribe((res:any)=>{
      if(res.message.includes("Not")){
      
        this.tostar.error(res.message,"Forget Password");
        this.Errormsg="Password reset link has been sent to your email.";
        this.isError=true;
        this.isForgotPassword=true;
      }
      else{
        this.Errormsg="";
        this.tostar.success(res.message,"Forget Password");
        this.isError=false;
      }
    });
  }

  onSubmit(): void {
    if (this.captcha1 == null) {
      this.tostar.error("Please Click on Captcha CheckBox","Login");
      //this.Errormsg = 'Please Click on Captcha CheckBox';
      this.isError = true;
      return;
    }
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        if(data.message==="Create new password."){
          window.location.href="ChangePassword";
        }
        else{
          this.user.setUserLogin();
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data.user);
          
          this.isLoginFailed = false;
          this.roles = this.tokenStorage.getUser().roles;
          if(this.cart.CheckcartItem()){
            this.router.navigate(['/checkOut']);
          }
          else{
            this.user.setUserLogin();
            this.router.navigate(['/dashboard']);
          }
        }
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  resolved(captchaResponse: any) {
    this.captcha1 = captchaResponse;
    if (this.captcha1 != null ) {
      this.isError = false;
    }
  }
}
