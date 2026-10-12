import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../data/products';

// Presentational child: shows data, emits events, owns no state.
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span data-test-id="product-name">{{ product.name }}</span>
    <span>{{ product.category }}</span>
    <span data-test-id="product-price">{{ product.price | currency }}</span>
    <span>{{ product.rating }}★</span>
    <button
      type="button"
      data-test-id="wishlist-toggle"
      [attr.aria-pressed]="wishlisted"
      [attr.aria-label]="(wishlisted ? 'Remove ' : 'Add ') + product.name + (wishlisted ? ' from' : ' to') + ' wishlist'"
      (click)="wishlistToggle.emit(product)"
    >
      {{ wishlisted ? '♥' : '♡' }}
    </button>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() wishlisted = false;
  @Output() wishlistToggle = new EventEmitter<Product>();
}
