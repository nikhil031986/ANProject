import { Component } from '@angular/core';

@Component({
  selector: 'app-stripepayment',
  standalone: true,
  imports: [],
  templateUrl: './stripepayment.component.html',
  styleUrl: './stripepayment.component.css'
})
export class StripepaymentComponent { constructor() { }
handler:any = null;
ngOnInit() {

  this.loadStripe();
}

pay(amount: any) {    

  var handler = (<any>window).StripeCheckout.configure({
    key: 'pk_test_51QE6A0P4RbfVfKlDD0Bq0jlSohA86fkTHmKicfJsUizrG04ApyKhv9JTfkJxkK4Is5Y81KxpKCkBFrnsiz8SR3xp00rV2HCz5g',
    locale: 'auto',
    token: function (token: any) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
      console.log(token)
      alert('Token Created!!');
    }
  });

  handler.open({
    name: 'Stripe Payment',
    description: '2 widgets',
    amount: amount * 100
  });

}

loadStripe() {
   
  if(!window.document.getElementById('stripe-script')) {
    var s = window.document.createElement("script");
    s.id = "stripe-script";
    s.type = "text/javascript";
    s.src = "https://checkout.stripe.com/checkout.js";
    s.onload = () => {
      this.handler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_51QE6A0P4RbfVfKlDD0Bq0jlSohA86fkTHmKicfJsUizrG04ApyKhv9JTfkJxkK4Is5Y81KxpKCkBFrnsiz8SR3xp00rV2HCz5g',
        locale: 'auto',
        token: function (token: any) {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          console.log(token)
          alert('Payment Success!!');
        }
      });
    }
     
    window.document.body.appendChild(s);
  }
}
}

