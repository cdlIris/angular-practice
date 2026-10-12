import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../data/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(): Observable<Product[]> {
    // TODO: GET /api/products with HttpClient
    throw new Error('Not implemented');
  }
}
