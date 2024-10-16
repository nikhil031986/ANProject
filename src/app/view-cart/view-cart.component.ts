import { Component } from '@angular/core';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-view-cart',
  
  templateUrl: './view-cart.component.html',
  styleUrl: './view-cart.component.css'
})
export class ViewCartComponent {

  constructor( private productService: ProductService) {}
  ngOnInit(): void {
   this.getCartDetailsForCart();
  }

  cartItems: any = [];  // Ensure the type is specified
  refKey: string = 'your-reference-key';  
   
  
    availableUnits = ['EACH', 'PACK', 'BOX']; // Add any units required
  
    increaseQuantity(index: number) {
      this.cartItems[index].quantity++;
    }
  
    decreaseQuantity(index: number) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--;
      }
    }
  
    removeItem(index: number) {
      this.cartItems.splice(index, 1);
    }
  
    // getTotal() {
    //   return this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    // }

    getCartDetailsForCart() {
      this.productService.getCart().subscribe(
        (data: any) => {
          this.cartItems = data;  // Now cartItems is properly assigned
        },
        (error) => {
          console.error('Error fetching cart items', error);  // Error handling
        }
      );
    }
  }