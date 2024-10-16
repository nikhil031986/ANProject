import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ImageSliderComponent } from '../common/image-slider/image-slider.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  quantity: number = 2;
  product:any;
  imagePath:any="";
  galleryImages:any = [];
  tabord:any=1;
  objunit:any=[];
  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.imagePath=environment.APIHost;
    this.getAllUnit();
    this.route.paramMap.subscribe((params) => {
      const productCode = params.get('productCode');
      this.getProductByProductCode(productCode);
    });
  }
  getAllUnit(){
    this.objunit=[];
    this.productService.getUnit().subscribe((res:any)=>{
      this.objunit = res;
      console.log(this.objunit);
    });
  }
  onUnitChange(val:any) {
    
  }
  activetabord(tab:any){
    this.tabord=tab;
      }
  getProductByProductCode(productCode:any){
    this.product = null;
    this.galleryImages=[];
    this.productService.getItemByItemCode(productCode).subscribe((res:any)=>{
      this.product = res;
      if(this.product != null && this.product != undefined){
        var path = String(this.imagePath)+String(this.product.imageUrl);
        this.galleryImages.push({
          img: String(this.imagePath)+String(this.product.imageUrl)
        });
      }
    });
  }

  increment() {
    if (this.quantity < 9999) {
      this.quantity++;
    }
  }

  // Decrement the quantity
  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Add to cart function
  addToCart() {
    this.productService.updateCartQuantity(this.quantity,this.product.item_Name,this.product.itemUnit); 
    console.log('Product added to cart:', this.quantity); // Update the cart quantity in the service
  }
}
