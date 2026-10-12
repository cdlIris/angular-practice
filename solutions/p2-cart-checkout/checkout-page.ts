import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PRODUCTS, Product } from '../data/products';

export interface CartLine {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-page.html',
})
export class CheckoutPageComponent {
  private fb = inject(FormBuilder);

  products: Product[] = [...PRODUCTS];
  lines: CartLine[] = [];
  successMessage = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
  });

  // --- cart ---

  get count(): number {
    return this.lines.reduce((sum, l) => sum + l.quantity, 0);
  }

  get total(): number {
    return this.lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  }

  addToCart(product: Product): void {
    this.successMessage = '';
    const line = this.lines.find((l) => l.product.id === product.id);
    if (line) line.quantity++;
    else this.lines.push({ product, quantity: 1 });
  }

  increase(line: CartLine): void {
    line.quantity++;
  }

  decrease(line: CartLine): void {
    line.quantity--;
    if (line.quantity <= 0) this.remove(line);
  }

  remove(line: CartLine): void {
    this.lines = this.lines.filter((l) => l !== line);
  }

  // --- form ---

  // Show an error only after the user touched or edited the field
  showError(field: string): boolean {
    const c = this.form.get(field)!;
    return c.invalid && (c.touched || c.dirty);
  }

  get canSubmit(): boolean {
    return this.form.valid && this.lines.length > 0;
  }

  submit(): void {
    if (!this.canSubmit) {
      this.form.markAllAsTouched();
      return;
    }
    const total = this.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    this.successMessage = `Thanks, ${this.form.value.name}! Order placed for ${this.count} item(s). Total: ${total}`;
    this.lines = [];
    this.form.reset(); // also clears touched/dirty, so no errors pop up
  }
}
