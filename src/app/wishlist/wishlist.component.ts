import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output,NgModule, OnInit } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ProductService } from 'src/app/_services/product.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { SearchComponent } from '../shared/search/search.component';
import { ImageSliderComponent } from '../common/image-slider/image-slider.component';
import { CartServiceService } from '../_services/cart-service.service';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule,SearchComponent,ImageSliderComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  imageURL:any;
  items:any=[];
  wishlists:any=[];
  userList:any=[];
  userId:any;
  galleryImages:any = [];
  selectedItem:any;
  quantity: number = 2;
  displayForm:boolean=false;
  wishlistName:any;
  selecedWishlist:any;
  selecedwishlistName:any;
  displaywishlistDetails:boolean=false;
  displaySearch:boolean=true;
  constructor(private prodcutService:ProductService,private usrService:UserService,private token : TokenStorageService,
    private tostar : ToastrService,private cart:CartServiceService
  ){}

  ngOnInit(): void {
    if(!this.usrService.userLogin()){
      window.location.href="/home";
    }
    this.userId=this.token.getUserInfo("Myapp_User_Id");
    this.imageURL=environment.APIHost;
    this.getUserWishlistData();
  }
  
    increment() {
      if (this.quantity < 9999) {
        this.quantity++;
      }
    }

    decrement() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    }

  openDrilDown(){
    this.items=[];
    this.getItemsFromApp();
  }

  getUserWishlistData(){
    this.wishlists=[];
    this.prodcutService.getwishlist(this.userId).subscribe((res:any)=>{
      if(res!= undefined && res != null && res.length>0){
        this.wishlists=res;
      }
    });
  }

  getwishlistItems(){
  this.userList=[];
  this.prodcutService.getWishlistDetails(this.selecedWishlist).subscribe((res:any)=>{
    if(res!= undefined && res != null && res.length>0){
      this.userList=res;
    }
  });
  }

  openWishlistDetails(wishlistId:any,wishlistName:any){
    this.selecedWishlist=wishlistId;
    this.selecedwishlistName=wishlistName;
    this.displaywishlistDetails=true;
    this.getwishlistItems();
  }


  DeleteWishlistItem(wishlistItemId:any){
    this.prodcutService.removeItemFromWishListItem(wishlistItemId).subscribe((res:any)=>{
      if(res != undefined && res != null){
        if(res.message.includes("not")){
          this.tostar.error(res.message,"wishlist");
        }else{
          this.tostar.success(res.message,"wishlist");
          this.getwishlistItems();
        }
      }
    });
  }

  DeleteProducttowishlist(wishlistId:any){
    this.prodcutService.removeItemFromWishList(wishlistId).subscribe((res:any)=>{
      if(res != undefined && res != null){
        if(res.message.includes("not")){
          this.tostar.error(res.message,"wishlist");
        }else{
          this.tostar.success(res.message,"wishlist");
          this.getUserWishlistData();
        }
      }
    });
  }

  addToCartItems(){
    this.userList.forEach((el:any)=>{
    this.prodcutService.getItemByItemCode(el.itemCode).subscribe((res:any)=>{
      if(res != undefined && res != null ){
        var item=res;
        this.cart.addToCart(item.item_Name,el.qty,item.item_Description,item.imageUrl,item.item_Price,item.itemUnit);
        this.tostar.success("Item add in cart successfully.","Cart");
      }
    });
  });
  }

  getProductByProductCode(event:any){
    this.galleryImages=[];
    this.prodcutService.getItemByItemCode(event).subscribe((res:any)=>{
      if(res != undefined && res != null ){
        this.selectedItem=res;
        this.selectedItem.item_Images.forEach((el:any)=>{
          if(el.fileName.includes(".jpg")){
            this.galleryImages.push({
              img: String(this.imageURL)+"Images/"+String(el.fileName)
            });
          }
        });
        
      }
    });
    this.displaySearch=false;
    this.displayForm=true;
  } 

  getItemsFromApp(){
    this.prodcutService.getAllItems().subscribe((res:any)=>{
      if(res != undefined && res != null && res.length>0){
        res.forEach((el:any)=>{
          this.items.push({
            itemCode:el.item_Name,
            decription: el.item_Description,
            imgUrl:el.imageUrl
          });
        })
      }
    });
  }
  onsubmitwishlistItem(){
    var objItems={
      wishlistId:this.selecedWishlist,
      itemCode:this.selectedItem.item_Name,
      qty:this.quantity
    };
    this.prodcutService.putWishlistItem(objItems).subscribe((res:any)=>{
      if(res != undefined && res != null){
        if(res.message.includes("not")){
          this.tostar.error(res.message,"wishlist");
        }else{
          this.tostar.success(res.message,"wishlist");
          this.displayForm=false;
          this.displaySearch=true;
          this.displaywishlistDetails=true;
          this.getwishlistItems();
        }
      }
    });
  }
  onSubmitWishlist(){
    var objItems={
      userId:this.userId,
      wishlist:this.wishlistName
    };
    this.prodcutService.putItemInWishlist(objItems).subscribe((res:any)=>{
      if(res != undefined && res != null){
        if(res.message.includes("not")){
          this.tostar.error(res.message,"wishlist");
        }
        else{
          this.tostar.success(res.message,"wishlist");
          this.displayForm=false;
          this.getUserWishlistData();
        }
      }
    });
  }

}
