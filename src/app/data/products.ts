export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
}

// Do not change this data: the tests depend on it.
export const PRODUCTS: Product[] = [
  { id: 1, name: 'Sony Headphones', category: 'audio', price: 349, rating: 4.7 },
  { id: 2, name: 'Bose Headphones', category: 'audio', price: 299, rating: 4.5 },
  { id: 3, name: 'Apple Laptop', category: 'computers', price: 1999, rating: 4.8 },
  { id: 4, name: 'Dell Laptop', category: 'computers', price: 1299, rating: 4.2 },
  { id: 5, name: 'Sony Speaker', category: 'audio', price: 199, rating: 4.1 },
  { id: 6, name: 'Logitech Mouse', category: 'accessories', price: 49, rating: 4.6 },
  { id: 7, name: 'Keychron Keyboard', category: 'accessories', price: 99, rating: 4.4 },
  { id: 8, name: 'Samsung Monitor', category: 'computers', price: 399, rating: 4.3 },
];
