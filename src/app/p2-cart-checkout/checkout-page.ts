import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRODUCTS, Product } from '../data/products';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-page.html',
})
export class CheckoutPageComponent {
  products: Product[] = [...PRODUCTS];

  // TODO: see README.md in this folder
}
