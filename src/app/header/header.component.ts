import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { environment } from 'src/environments/environment';
import { AnonymousSubject } from 'rxjs/internal/Subject';

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
  constructor(private userService: UserService) {
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
  }

}
