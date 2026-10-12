import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../data/products';
import { ProductService } from './product.service';
import { ProductCardComponent } from './product-card';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './shop-page.html',
})
export class ShopPageComponent implements OnInit {
  private productService = inject(ProductService);

  // data state
  products: Product[] = [];
  loading = false;
  error = '';

  // UI state
  searchText = '';
  selectedCategory = '';
  sortBy = '';
  page = 1;
  pageSize = 3;
  wishlist = new Set<number>();

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.loading = false;
      },
    });
  }

  get categories(): string[] {
    return [...new Set(this.products.map((p) => p.category))];
  }

  // filter -> sort -> (paginate in pagedProducts)
  get filteredProducts(): Product[] {
    const q = this.searchText.trim().toLowerCase();
    const result = this.products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (!this.selectedCategory || p.category === this.selectedCategory),
    );
    // sort() mutates, so copy first
    if (this.sortBy === 'price-asc') return [...result].sort((a, b) => a.price - b.price);
    if (this.sortBy === 'price-desc') return [...result].sort((a, b) => b.price - a.price);
    if (this.sortBy === 'rating-desc') return [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pagedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  onCriteriaChange(): void {
    this.page = 1;
  }

  prev(): void {
    if (this.page > 1) this.page--;
  }

  next(): void {
    if (this.page < this.totalPages) this.page++;
  }

  isWishlisted(p: Product): boolean {
    return this.wishlist.has(p.id);
  }

  toggleWishlist(p: Product): void {
    if (this.wishlist.has(p.id)) this.wishlist.delete(p.id);
    else this.wishlist.add(p.id);
  }

  trackById(_: number, p: Product): number {
    return p.id;
  }
}
