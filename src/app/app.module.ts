import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SubCatgoryComponent } from './sub-catgory/sub-catgory.component';
import { ItemcatwiseComponent } from './itemcatwise/itemcatwise.component';
import { ImageSliderComponent } from './common/image-slider/image-slider.component';
import { ProductDetailModule } from './product-detail/product-detail.module';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { ToastrModule } from 'ngx-toastr';
import { ToasterService } from './services/toaster.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckoutComponent } from './checkout/checkout.component';
import { RevieworderComponent } from 'src/revieworder/revieworder.component';
import { RouterModule } from '@angular/router';



@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ChangePasswordComponent,
        HomeComponent,
        ProfileComponent,
        BoardAdminComponent,
        BoardModeratorComponent,
        BoardUserComponent,
        HeaderComponent,
        FooterComponent,
        SideMenuComponent,
        SubCatgoryComponent,
        ItemcatwiseComponent,
        RevieworderComponent,
        ViewCartComponent,
        
        
        
        
            ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        CheckoutComponent,
        ImageSliderComponent,
        ProductDetailModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterModule,
        ToastrModule.forRoot(),
       
              
        FormsModule], providers: [authInterceptorProviders,ToasterService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
