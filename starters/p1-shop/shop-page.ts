import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../data/products';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-page.html',
})
export class ShopPageComponent {
  products: Product[] = [];

  // TODO: see README.md in this folder
}
