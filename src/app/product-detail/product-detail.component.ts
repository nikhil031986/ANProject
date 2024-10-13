import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  
  product:any;
  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
  }

  getProductByProductCode(productCode:any){
    this.product = null;
    this.productService.getItemByItemCode(productCode).subscribe((res:any)=>{
      this.product = res;
    });
  }
}
