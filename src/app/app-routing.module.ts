import { NgModule, Query } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { SubCatgoryComponent } from './sub-catgory/sub-catgory.component';
import { ItemcatwiseComponent } from './itemcatwise/itemcatwise.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductDetailModule } from './product-detail/product-detail.module';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { RevieworderComponent } from 'src/revieworder/revieworder.component';
import { CurrentCustomerAllOrderComponent } from './current-customer-all-order/current-customer-all-order.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { CreateAndUpdateAddressComponent } from './create-and-update-address/create-and-update-address.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { QuotesComponent } from './quotes/quotes.component';
import { OrderInvoiceComponent } from './order-invoice/order-invoice.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'subCatgory/:categoryTranId', component: SubCatgoryComponent },
  { path: 'subCatgory/:categeryName', component: SubCatgoryComponent },
  { path:'productDetail/:productCode/:desc',component:ProductDetailComponent},
  { path: 'itemcatwise', component: ItemcatwiseComponent },
  { path: 'viewCart', component: ViewCartComponent },  
  { path: 'revieworder/:order', component: RevieworderComponent },
  { path:'allOrder',component:CurrentCustomerAllOrderComponent},
  { path:'paymentSuccess/:order',component:PaymentSuccessComponent},
  { path:'paymentFailed',component:PaymentSuccessComponent},
  { path: 'checkOut', component: CheckoutComponent },
  { path: 'CreateUpdateAddress/:location', component: CreateAndUpdateAddressComponent },
  { path:'ChangePassword', component:ChangePasswordComponent},
  { path:'dashboard', component:UserHomeComponent},
  { path:'OrderHistory',component:OrderHistoryComponent},
  { path:'Shipment',component:ShipmentComponent},
  { path:'Quotes',component:QuotesComponent},
  { path:'Invoice',component:OrderInvoiceComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
