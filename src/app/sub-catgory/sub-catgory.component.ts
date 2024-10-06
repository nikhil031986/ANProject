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
      const newCategoryId = params.get('parentCategoryId'); // Retrieve the parent category ID
      if (newCategoryId) {
        this.getChildMenu(newCategoryId); // Fetch child items for the selected parent category
      }
    });
    // this.route.paramMap.subscribe((params) => {
    //   this.parentCategoryId = params.get('parentMenuId');
    //   console.log('Parent Category ID:', this.parentCategoryId); // Log the ID
    //   this.getChildMenu(this.parentCategoryId); // Get child menu items for the selected parent category
    // });
  }

  // Method to filter child menu items based on the parent category ID
  getChildMenu(parentMenuId: any) {
    this.childMenuItems = this.childMenuItem.filter((item: any) => item.parentCategory === parentMenuId);
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
      
      // After fetching menu items, we can filter child menu items based on the current parentCategoryId
      this.getChildMenu(this.parentCategoryId);
    }, (error) => {
      console.error('Error fetching menu items:', error); // Handle error
    });
  }
}

