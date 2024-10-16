import { Component } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrl: './view-cart.component.css'
})

export class ViewCartComponent {
  imgeUrl:any="";
  totalAmount:any=0.0;
  isLoggedIn:boolean=true;
  isEmpty:boolean=true;
  constructor( private productService: ProductService,private userService:UserService,private router: Router) {}
  ngOnInit(): void {
    this.imgeUrl = environment.APIHost;
    this.getUnit();
   this.getCartDetailsForCart();
  }
  availableUnits:any =[]; // Add any units required

  getUnit(){
    this.productService.getUnit().subscribe((res:any)=>{
      this.availableUnits = res;
      console.log(this.availableUnits);
    });
  }
  cartItems: any = [];  // Ensure the type is specified
  refKey: string = 'your-reference-key';  
   
  
  
    increaseQuantity(index: number) {
      this.cartItems[index].quantity++;
    }
  
    checkout(){
      if(this.userService.userLogin()){

      }else{
        this.router.navigate(['/login']);
      }
    }
    decreaseQuantity(index: number) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--;
      }
    }
  
    removeItem(index: number) {
      var item = this.cartItems[index];
      this.productService.removeFromCart(item.itemCode).subscribe((res:any)=>{
        this.productService.removeFromCart(item.quntity);
        this.cartItems.splice(index, 1);
      });
    }
  
    // getTotal() {
    //   return this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    // }

    getCartDetailsForCart() {
      this.productService.getCart().subscribe(
        (data: any) => {
          this.cartItems = data;  // Now cartItems is properly assigned
          console.log(this.cartItems);
          if(this.cartItems != undefined && this.cartItems != null){
            this.isEmpty=false;
          }
          this.totalAmount=parseFloat( this.cartItems.reduce((sum:any, item:any) => sum + (item.itemPrice*item.quntity), 0)).toFixed(2);
        }
      );
    }
  }