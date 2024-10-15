import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  
  product:any;
  imagePath:any="";
  galleryImages:any = [];
  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.imagePath=environment.APIHost;
    this.route.paramMap.subscribe((params) => {
      const productCode = params.get('productCode');
      this.getProductByProductCode(productCode);
    });
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
}
