import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-sub-catgory',
  templateUrl: './sub-catgory.component.html',
  styleUrls: ['./sub-catgory.component.css']
})
export class SubCatgoryComponent implements OnInit {

  parentCategoryId: any;
  childMenuItems: any[] = [];
  menuItems: any[] = []; // Array to hold parent menu items
  childMenuItem: any[] = []; // Array to hold all child menu items

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.getMenuItem(); // Fetch all menu items when the component initializes

    this.route.paramMap.subscribe((params) => {
      const categoryTranId = params.get('categoryTranId'); 
      if (categoryTranId) {
        this.getChildMenu(categoryTranId); 
      }
    });
  }

 getChildMenu(parentMenuId: any) {
    this.childMenuItems = this.childMenuItem.filter((item: any) => item.parentCategory === Number(parentMenuId));
    console.log('Filtered Child Menu Items:', this.childMenuItems); // Log filtered child menu items
}

  // Method to fetch menu items from the service
  getMenuItem(): void {
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
      const currentCategoryId = this.route.snapshot.paramMap.get('categoryTranId');
      if (currentCategoryId) {
        this.getChildMenu(currentCategoryId);
      }
    }, (error) => {
      console.error('Error fetching menu items:', error); // Handle error
    });
  }
}

