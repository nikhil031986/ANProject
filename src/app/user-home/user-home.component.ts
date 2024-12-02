import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {
  IsUserLogin:any;
  constructor(private userservice:UserService,
    private token:TokenStorageService,private router: Router){}
    async ngOnInit(){
      this.IsUserLogin= this.token.userLogin();
      if(!this.IsUserLogin){
        window.location.href="/home";
      }
    }
    
    openCategr(){
      this.router.navigate(['/subCatgory',0]);
    }

    openOrderHistory(){
      this.router.navigate(['/OrderHistory']);
    }

    openChangePassword(){
      this.router.navigate(['/ChangePassword']);
    }

    openShipmentOrders(){
      this.router.navigate(['/Shipment']);
    }

    openQuotes(){
      this.router.navigate(['/Quotes']);
    }

    openInvoice(){
      this.router.navigate(['/Invoice']);
    }
}
