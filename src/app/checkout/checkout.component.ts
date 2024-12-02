import { Component, output } from '@angular/core';
import { CommonModule, CurrencyPipe, NumberSymbol } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartServiceService } from '../_services/cart-service.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialogComponent } from '../address-dialog/address-dialog.component';
import { ProductService } from '../_services/product.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule], // Make sure CommonModule is imported
  providers: [CurrencyPipe],
 // imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  btnAddressText:any;
  shippingForm!: FormGroup;
  
  billingForm!: FormGroup;
  orderDetailsForm!:FormGroup;
  paymentForm!: FormGroup;
  IsUserLogin:boolean=false;   
  imgeUrl:any="";
  displayShipAdd:any="";
  billingAddress:any="";
  customerDetails:any[]=[];
  cartItems:any[]=[];
  customerMaster:any;
  contactDetails:any;
  paymentTerm:any[]=[];
  paymentMethod:any[]=[];
  SystemShipVia:any[]=[];
  customerAddress:any;
  shipmentAddress:any[]=[];
  shipingLocation:any;
  SelectedlocationId:any;
  constructor(private fb: FormBuilder,private cart:CartServiceService,private userservice:UserService,
    private token:TokenStorageService,private router: Router,
    private productservice:ProductService,private toastera:ToasterService,private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.SelectedlocationId=0;
    this.btnAddressText="Add Address";
    this.imgeUrl = environment.APIHost;
    this.IsUserLogin= this.token.userLogin();
    this.getCustomerDetails();
    this.getCartData();
    this.initShippingForm();
    this.initBillingForm();
    this.initOrderDetailsForm();
    this.initPaymentForm();
  }

  onAddressChange(event:any){
    var docuele = document.getElementById("#Selectedaddress");
    this.btnAddressText="Update Address";
    const selectedValue = event.target.value;
    const shipadd = this.shipmentAddress.filter((res:any)=> res.location === selectedValue);
    if(shipadd != undefined && shipadd != null){
      this.SelectedlocationId=shipadd[0].customerLocationId;
      this.displayShipAdd = "<h4> Name : "+ shipadd[0].name+"</h4>"
      +"<span>"+shipadd[0].location +"<br/> "+
      shipadd[0].address1 +" "+ shipadd[0].address2 +" "+ shipadd[0].address3
      +"<br/>"+ shipadd[0].city+"<br/> "+shipadd[0].state+"<br/> " + shipadd[0].country 
      +"<br/>"+ shipadd[0].postal+ "</span>";
      this.shippingForm.controls["billingAddress1"].setValue(shipadd[0].address1);
      this.shippingForm.controls["billingAddress2"].setValue(shipadd[0].address2);
      this.shippingForm.controls["state"].setValue(shipadd[0].state);
      this.shippingForm.controls["country"].setValue(shipadd[0].country);
      this.shippingForm.controls["phone"].setValue("");
      this.shippingForm.controls["city"].setValue(shipadd[0].city);
      this.shippingForm.controls["postalCode"].setValue(shipadd[0].postal);
      console.log(this.SelectedlocationId);
      this.calCulateTaxAmountItemWise();
    }
    //docuele?.innerHTML("<h4> Address </h4><br/><h4>"+selectedValue+"</h4>");
  }
  getCustomerDetails(){
    const currentCustomerId = this.token.getUserInfo("Customer_Id");
    this.userservice.GetCustomerDetails(currentCustomerId).subscribe((res:any)=>{
      this.customerDetails= res;
      if(this.customerDetails != null && this.customerDetails != undefined){
        this.customerMaster = this.customerDetails[0].customerMaster;
        this.customerAddress = this.customerDetails[0].customerLocationInformation;
        this.paymentTerm = this.customerDetails[0].paymentTerm;
        this.paymentMethod = this.customerDetails[0].paymentMethod;
        this.contactDetails = this.customerDetails[0].contactDetails;
        this.SystemShipVia = this.customerDetails[0].systemShipVia;
        this.shipingLocation = this.customerDetails[0].shipingLocation[0];
        this.shipmentAddress = this.customerDetails[0].shipAddresses;

        this.billingAddress = "<h4> Name :"+this.customerMaster?.firstName+"</h4>"+
        "<h6> Email :"+this.customerMaster?.email+"</h6>"+
        "<span>"+ this.customerAddress?.address1+"<br/>"+
        this.customerAddress?.address2+"<br/>"+
        this.customerAddress?.address3+"<br/>"+
        this.customerAddress?.city+"<br/>"+
        this.customerAddress?.state+"<br/>"+
        this.customerAddress?.country+"<br/></span>";
      }
    });
  }

  calCulateTaxAmountItemWise(){
    let shipobj:any[]=[]; 
    shipobj.push({
      Id:0,
      OrderId:0,
      Address1:this.shippingForm.controls["billingAddress1"].value,
      Address2:this.shippingForm.controls["billingAddress2"].value,
      State:this.shippingForm.controls["state"].value,
      Contry:this.shippingForm.controls["country"].value,
      PhoneNumber:this.shippingForm.controls["phone"].value,
      City:this.shippingForm.controls["city"].value,
      Email:"",
    });

    this.cartItems.forEach(item=>{
      let amount = item.amount;
      let objproduct:any[]=[];
      objproduct.push({
        product_tax_code:item.ItemCode,
        unit_price:item.itemPrice,
        quantity:item.qty,
      });
      let objTaxt={
        from_country:"US",
        from_zip:"73001",
        from_state:"OK",
        from_city:"OK",
        to_country:shipobj[0].Contry,
        to_zip:this.shippingForm.controls["postalCode"].value,
        to_state:shipobj[0].State,
        to_city:shipobj[0].city,
        amount:amount,
        shipping:"0.1",
        line_items:objproduct
      };
      this.productservice.calculationOfTax(objTaxt).subscribe((res:any)=>{
        if(res != undefined && res != null){
          console.log(res);
          var sumAmt =0;
          item.taxRate = Number(res.rate);
          item.taxAmount=Number(res.amount);
          item.netAmount = Number(res.amount)+Number(item.amount);
        }
      });
    });
    

  }

  getCartData(){
    this.cart.getCart().subscribe((res:any)=>{
      let objRes = res;
      objRes.forEach(item => {
        this.cartItems.push({
          itemCode:item.itemCode,
          imagePath:item.imagePath,
          item_Description:item.item_Description,
          quntity:item.quntity,
          itemPrice:item.itemPrice,
          amount:Number(item.quntity)*Number(item.itemPrice),
          taxRate:0.00,
          taxAmount:0.00,
          netAmount: Number(item.quntity)*Number(item.itemPrice)
        });
      });
      console.log(this.cartItems);
    });
  }

  // Initialize Shipping Form
  initShippingForm() {
    this.shippingForm = this.fb.group({
      sameAsBilling: [false], // Checkbox, no validators required
      residential: [false],   // Checkbox, no validators required
      shippingToName: ['', [Validators.required, Validators.minLength(3)]],
      blindShopping: [false], // Checkbox, no validators required
      attn: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10 digit phone number validation
      address: ['', [Validators.required, Validators.minLength(5)]],
      billingAddress1: ['', [Validators.required, Validators.minLength(5)]],
      billingAddress2: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]] // 5 digit postal code
    });
  }


  // Initialize Billing Form
  initBillingForm() {
    this.billingForm = this.fb.group({
      billingName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3)]],
      fax:['', [Validators.required, Validators.minLength(3)]],
      address:['', [Validators.required, Validators.minLength(3)]],
      billingAddress1:['', [Validators.required, Validators.minLength(3)]],
      billingAddress2:['', [Validators.required, Validators.minLength(3)]],
      state:['', [Validators.required, Validators.minLength(3)]],
       City: ['', [Validators.required, Validators.minLength(2)]],
    postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]] // Example for US ZIP Code pattern
    });
  }

  initOrderDetailsForm() {
    this.orderDetailsForm = this.fb.group({
      cancelDate: ['', Validators.required],
      jobRelease: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      poNumber: ['', Validators.required],
      contact: ['', Validators.required],
      enteredBy: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      paymentType: ['', Validators.required],
      shipVia: ['', Validators.required],
      shippingAccount: ['', Validators.required],
      additionalInfo: ['']
    });
  }

  initPaymentForm() {
    this.paymentForm = this.fb.group({
      cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
      cardType: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]], // 16 digits for a credit card
      securityCode: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]], // 3-4 digits for CVV
      expirationMonth: ['', [Validators.required]],
      expirationYear: ['', [Validators.required]],
      address1: ['', [Validators.required, Validators.minLength(5)]],
      address2: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Handle submission for shipping form
  onSubmitShipping(): void {
    if (this.shippingForm.valid) {
      console.log('Shipping Info:', this.shippingForm.value);
      // Perform actions with the shipping data, like sending to backend
    } else {
      console.log('Shipping form is invalid');
    }
  }

  // Handle submission for billing form
  onSubmitBilling(): void {
    if (this.billingForm.valid) {
      console.log('Billing Info:', this.billingForm.value);
      // Perform actions with the billing data, like sending to backend
    } else {
      console.log('Billing form is invalid');
    }
  }

  // Method to handle proceeding to payment
  onProceedToPayment(): void {
    if (this.shippingForm.valid && this.billingForm.valid) {
      console.log('Proceeding to payment with:');
      console.log('Shipping Info:', this.shippingForm.value);
      console.log('Billing Info:', this.billingForm.value);
      // Navigate to the payment page or execute payment logic here
    } else {
      console.log('Please complete both forms before proceeding');
    }
  }

  // Optional: Getter methods for easy access to form controls in the template (for validation display)
  get shippingControls() {
    return this.shippingForm.controls;
  }

  get billingControls() {
    return this.billingForm.controls;
  }
  onSubmitOrderDetails(){
    
  }

  onSubmitPayment(){

  }
  // Function to remove item from the cart
  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }

  // Function to update total price based on quantity
  updateTotalPrice(index: number): void {
    const item = this.cartItems[index];
    item.totalPrice = item.quantity * item.unitPrice;
  }

  onClickContinue(){
    const objorder:any[]=[];
    const shipobj:any[]=[];
    const OrderPaymentEntry:any[]=[];
    const OrderDetailEntry:any[]=[];
    const currentCustomerId = this.token.getUserInfo("Customer_Id");
    const today = new Date();

    shipobj.push({
      Id:0,
      OrderId:0,
      Address1:this.shippingForm.controls["billingAddress1"].value,
      Address2:this.shippingForm.controls["billingAddress2"].value,
      State:this.shippingForm.controls["state"].value,
      Contry:this.shippingForm.controls["country"].value,
      PhoneNumber:this.shippingForm.controls["phone"].value,
      City:this.shippingForm.controls["city"].value,
      Email:"",
      locationId:this.SelectedlocationId,
    });

    var amount=0;
    var taxAmount=0.0;
    this.cartItems.forEach( (element) => {
      OrderDetailEntry.push({
        Id:0,
        OrderId:0,
        ItemCode:element.itemCode,
        ItemPrice:element.itemPrice,
        Unit:"each",
        Qty:element.quntity,
        taxrate:element.taxRate,
        taxamount:element.taxAmount,
        netAmount:element.netAmount,
        CreateAt:Date.now,
        });
        taxAmount= taxAmount+Number(element.taxamount);
        amount=amount+(Number(element.itemPrice)*Number(element.quntity));
      });

      OrderPaymentEntry.push({
        Id:0,
        OrderId:0,
        PaymentType:1,
        PaymentTerm:0,
        Amount:amount,
        Rebate:0.0,
        SubTotal:(amount+taxAmount),
        TaxAmount:taxAmount
      });

      objorder.push({
          Id:0,
          OrderId:"",
          CustomerId:currentCustomerId,
          OrderDate:today,
          PaymentMethodId:1,
          PaymentTermId:1,
          TotalAmout:amount+taxAmount,
          DiscountAmount:0.20,
          OrderDetails:OrderDetailEntry,
          OrderPayments:OrderPaymentEntry,
          OrderShipments:shipobj,
          PurcharOrderNo:"",
        });
  
        this.productservice.PutOrder(objorder[0]).subscribe((res:any)=>{
          console.log(res);
          const message = res.message;
          if(message != undefined && message != null){
            if(String(message).includes("Order not added")){
              this.toastera.error(message); 
            }
            else{
              this.toastera.success("Order please successfully.");
              this.router.navigate(['/revieworder',message]);
              //window.location.href="\home";
            }
          }
        });    
  }

  openDialog(): void {
    // const dialogRef = this.dialog.open(AddressDialogComponent, {
    //   panelClass: 'custom-dialog-container',
    //   width: '220vw',  // Optional: adjust this width to control sizing
    //   maxWidth: '500px', // Constrain width for larger screens
    // });
  
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     console.log('Address data:', result);
    //   }
    // });
    this.router.navigate(['/CreateUpdateAddress',this.SelectedlocationId]);
  }
  
  }
 
