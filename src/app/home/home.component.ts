import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  content?: string;
  menuItems:any=[];
  childMenuItem:any=[];
  activeCategoryId: number | null = null;
  constructor(private userService: UserService) { 
   
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
  }
  toggleCategory(categoryTranId: number) {
    this.activeCategoryId = this.activeCategoryId === categoryTranId ? null : categoryTranId;
  }
  GetChildMenu(parentMenuId:any){
   // console.log(this.childMenuItem);
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
