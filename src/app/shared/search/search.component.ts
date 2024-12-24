import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output,NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ProductService } from 'src/app/_services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Output() searchChanged: EventEmitter<string> = new EventEmitter<string>();
  searchTerm: string = '';
  items:any[]=[];
  showData: any;
  itemSelected: boolean = false;
  imageURL:any= environment.APIHost;
  constructor(private prductservice:ProductService){}
  onSearchChange($event:any) {
    if($event.key == "Enter"){
      this.getProductByProductCode(this.searchTerm);
    }
    //this.searchTerm = $event.data;
    //this.searchChanged.emit(this.searchTerm); // Emit search term on change
    this.imageURL=environment.APIHost;
    this.items=[];
    if(this.searchTerm != undefined && this.searchTerm != null && this.searchTerm.length>0){
      this.prductservice.searchItems(this.searchTerm).subscribe((res:any)=>{
        res.forEach(element => {
          this.items.push(element);
        });
        if(this.items.length>0){
          this.showData=1;
        }
      });
    }
  }
  getProductByProductCode(productCode:any){
    this.items=[];
    this.searchTerm="";
    this.searchChanged.emit(productCode);
  }
}
