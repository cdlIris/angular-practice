import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopPageComponent } from './p1-shop/shop-page';
import { CheckoutPageComponent } from './p2-cart-checkout/checkout-page';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ShopPageComponent, CheckoutPageComponent],
  templateUrl: './app.html',
})
export class App {
  active = 0;
}
