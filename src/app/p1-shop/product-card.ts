import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../data/products';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `<!-- TODO: name, price and a wishlist heart button. See README.md -->`,
})
export class ProductCardComponent {
  // TODO: turn these into a real component input / output
  product!: Product;
  wishlisted = false;
  wishlistToggle = new EventEmitter<Product>();
}
