import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { environment } from 'src/environments/environment';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { ProductService } from '../_services/product.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  content?: string;
  isdirectsec:any;
  iskyraden:any;
  contactDetails:any;
  trybyUrl:any;
  menuItems:any=[];
  childMenuItem:any=[];
  cartQuantity: number = 0;

  constructor(private userService: UserService,private productService: ProductService,private cdr: ChangeDetectorRef) {
    this.isdirectsec=environment.isdirectsec;
    this.iskyraden = environment.iskyraden;
    this.contactDetails="info@metroboltmi.com";
    this.trybyUrl="https://www.metroboltmi.com/industries-served";
   }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        this.content = JSON.parse(err.error).message;
      }
    });
    
    this.getMenuItem();
    this.productService.currentQuantity.subscribe((quantity) => {
      this.cartQuantity = quantity;
      console.log('Cart quantity updated in UI:', this.cartQuantity);
      this.cdr.detectChanges();
    });
  }
  GetChildMenu(parentMenuId:any){
    return this.childMenuItem.filter((item:any)=> item.parentCategory == parentMenuId); 
  }

  getMenuItem():void{
    this.userService.GetMenuItem().subscribe((res: any) => {
      console.log(res);
      this.menuItems=[];
      this.childMenuItem=[];
      var items : any=[];
      items = res;
      items.forEach((element:any) => {
        if(element.parentCategory!==0){
          this.childMenuItem.push(element);
        }
        else{
          this.menuItems.push(element);
        }
      });
    });
  }
}
