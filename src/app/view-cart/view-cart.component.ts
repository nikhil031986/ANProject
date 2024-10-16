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
  quantity: number= 0;
  product:any;
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
   
  
  
    // increaseQuantity(index: number) {
    //   this.cartItems[index].quantity++;
    // }
  
    increaseQuantity(index: number) {
      if (this.cartItems[index] && this.cartItems[index].quntity !== undefined) {
        console.log("Before increment:", this.cartItems[index].quntity);
        this.cartItems[index].quntity++;
        const itemCode = this.cartItems[index].itemCode;  // Extract ItemCode
        const unit = this.cartItems[index].unit;          // Extract unit
      //  this.addToCart(itemCode, unit);   
       // this.addToCart();
        this.productService.updateCartQuantity(this.cartItems[index].quntity, itemCode, unit);
      //  this.productService.updateCartQuantity(this.cartItems[index].quntity);
        console.log("After increment:", this.cartItems[index].quntity);
      }
    }
    decreaseQuantity(index: number) {
      if (this.cartItems[index] && this.cartItems[index].quntity > 1) {
          console.log("Before decrement:", this.cartItems[index].quntity);
          this.cartItems[index].quntity--;
          const itemCode = this.cartItems[index].itemCode;  // Extract ItemCode
          const unit = this.cartItems[index].unit;
          this.productService.updateCartQuantity(this.cartItems[index].quntity, itemCode, unit);
  
          console.log("After decrement:", this.cartItems[index].quntity);
      }
  }
  
    
    // decreaseQuantity(index: number) {
    //   if (this.cartItems[index] && this.cartItems[index].quntity > 1) {
    //     console.log("Before decrement:", this.cartItems[index].quntity);
    //     this.cartItems[index].quntity--;
    //     const itemCode = this.cartItems[index].itemCode;  // Extract ItemCode
    //     const unit = this.cartItems[index].unit; 
    //    // this.addToCart();        
    //     this.productService.updateCartQuantity(this.cartItems[index].quntity, itemCode, unit);

    //     console.log("After decrement:", this.cartItems[index].quntity);
    //   }
    // }
    checkout(){
      if(this.userService.userLogin()){

      }else{
        this.router.navigate(['/login']);
      }
    }
    // decreaseQuantity(index: number) {
    //   if (this.cartItems[index].quantity > 1) {
    //     this.cartItems[index].quantity--;
    //   }
    // }
  
    removeItem(index: number) {
      var item = this.cartItems[index];
      this.productService.removeFromCart(item.itemCode).subscribe((res:any)=>{
        this.productService.removeQtyFromCart(item.quntity);
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

    // addToCart() {
    //   this.productService.updateCartQuantity(this.quantity,this.product.item_Name,this.product.itemUnit); 
    // }
  }