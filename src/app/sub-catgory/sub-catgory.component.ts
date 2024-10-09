import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-sub-catgory',
  templateUrl: './sub-catgory.component.html',
  styleUrls: ['./sub-catgory.component.css']
})
export class SubCatgoryComponent implements OnInit {

  SaFilterLable: any;
  parentCategoryId: any;
  childMenuItems: any[] = [];
  menuItems: any[] = []; // Array to hold parent menu items
  childMenuItem: any[] = []; // Array to hold all child menu items
  Items:any[]=[];
  setopenview: any = '0';
  showsafilter: any = '1';
  showsafilter1: any = '1';
  LowestPriceFirst: any;
  highestPriceFirst: any;
  ItemAtoZ: any;
  ItemZtoA: any;
  ListTypeView:any='1';
  TableView:any='0';
  itlable:any;
  LowestQtyFirst: any;
  highestQtyFirst: any;
  descrAtoZ: any;
  descrZtoA: any;
  QuantitySort: any;
  DimensionLable:any;
  Sequencelable:any;
  sa13sortasc:any;
  sa13sortdesc:any;
  newestfirstsortlabel:any;
  isListView:any='1';
  objcategory:any=0;
  mancategory:any;
  txtCategory:any="";
  constructor(private route: ActivatedRoute, private userService: UserService) {}

  async ngOnInit() {
    this.itlable="Product Name :"
    this.mancategory=null;
    await this.getMenuItem(); // Fetch all menu items when the component initializes
    this.SaFilterLable="Product Details"
    this.route.paramMap.subscribe((params) => {
      const categoryTranId = params.get('categoryTranId');
      if(isNaN(Number(categoryTranId))){
        this.objcategory = this.getCategoryIdFromCategory(categoryTranId);
      }
      else{
        this.objcategory=categoryTranId; 
      }
      if (this.objcategory) {
        this.getChildMenu(this.objcategory); 
        this.getItemFromAPI(this.objcategory);
      }
      this.getCurrentCategory();
    });
  }
  getCategoryIdFromCategory(categoryName:any){
    var Id = this.menuItems.filter((x:any)=> x.category===categoryName)[0].categoryTranId;
    if(Id === undefined || Id === null){
      Id =  this.childMenuItem.filter((item: any) => item.category===categoryName)[0].categoryTranId;
    }
    return Id;
  }
 getChildMenu(parentMenuId: any) {
  if(Number(parentMenuId)===0){
    this.childMenuItems =this.menuItems;
  }
  else{
    this.childMenuItems = this.childMenuItem.filter((item: any) => item.parentCategory === Number(parentMenuId));
  }
    console.log('Filtered Child Menu Items:', this.childMenuItems); // Log filtered child menu items
}
setlistview(listvi :any) {
  this.isListView = listvi;
}

getItemFromAPI(categoryId:any){
  if(categoryId != undefined || categoryId != null || Number(categoryId)>0){
    this.Items=[];
    this.userService.GetItemByCategory(categoryId).subscribe((res:any)=>{
      res.forEach((element: any) => {
        this.Items.push(element);   
      });
      console.log(this.Items);
    });
  }
}

getsetopenview(listvi:any) {

  listvi = (listvi == '1' ? '0' : '1');
  this.setopenview = listvi;
  //$("#Filters").slideToggle("slow");
}

lowestFirst() {
    this.Items.sort((a,b) => 0 - (a.item_Price > b.item_Price ? -1 : 1));
    this.Items.sort((a,b) => 0 - (a.item_Price > b.item_Price ? -1 : 1));
}
highestFirst() {
  this.Items.sort((a,b) => 0 - (a.item_Price > b.item_Price ? 1 : -1));
}
AtoZ(){
  this.Items.sort();
}

getCurrentCategory(){
  console.log("Current Category Id == "+ this.objcategory);
  this.mancategory = this.menuItems.filter((x:any)=> x.categoryTranId==this.objcategory)[0];
  if(this.mancategory === null && this.mancategory === undefined ){
    this.mancategory = this.childMenuItems.filter((x:any)=> x.categoryTranId==this.objcategory)[0];
    this.txtCategory = this.mancategory.category;
  } else{
    this.txtCategory = this.mancategory.category;
  }
  console.log(this.mancategory);
}
  // Method to fetch menu items from the service
  async getMenuItem() {
    this.userService.GetMenuItem().subscribe((res: any) => {
      console.log('API Response:', res); // Log the API response
      this.menuItems = [];
      this.childMenuItem = [];
      
      res.forEach((element: any) => {
        if (element.parentCategory !== 0) {
          this.childMenuItem.push(element); // Push to child menu items array
        } else {
          this.menuItems.push(element); // Push to parent menu items array
        }
      });
      
      if (this.objcategory) {
        this.getChildMenu(this.objcategory);
      }
      this.getCurrentCategory();
      
    }, (error) => {
      console.error('Error fetching menu items:', error); // Handle error
    });
  }
}

