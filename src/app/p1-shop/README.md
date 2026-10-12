# P1 — Shop Page (45 min)

Load products from an API and show them with search, category filter, sort, pagination and a wishlist.
Covers: Service + HttpClient, loading/error/empty states, `ngModel`, getters, `*ngFor`/`*ngIf`,
child component with `@Input`/`@Output`, `Set` state, accessibility.

Suggested order (run `npm run test:p1` after each step):
1. Service + load with loading / error / retry
2. List + search + category + sort
3. Pagination
4. Extract `ProductCardComponent` + wishlist

## ProductService (`product.service.ts`)
`getProducts(): Observable<Product[]>` → `GET /api/products` with `HttpClient`.

## ShopPageComponent (`shop-page.ts`, selector `app-shop-page`)

**Loading**
1. Load products when the component initializes.
2. While loading show `Loading...`. On failure show `Failed to load products` and a `Retry` button that loads again.
   Never show loading, error and the list at the same time.

**List** (shown after a successful load)
3. Search by name, partial and case-insensitive.
4. Category dropdown: `All` (value `""`) then each category once, in order of first appearance.
5. Sort dropdown values: `""` (original order), `price-asc`, `price-desc`, `rating-desc`. Must not mutate the original order.
6. 3 products per page. `Page X of Y` (`Page 1 of 1` when empty). Prev/Next disabled at the ends.
   Changing search, category or sort goes back to page 1.
7. No matches (or API returned nothing): `No products found`.
8. Search input must have an accessible label (`<label for>`, wrapping `<label>`, or `aria-label`).

**Wishlist**
9. Render each product with `<app-product-card>`. Keep wishlist state in the **page** (not the card).
10. Show the number of wishlisted products. The wishlist survives search and paging.

## ProductCardComponent (`product-card.ts`, selector `app-product-card`)
- Inputs: `product`, `wishlisted` (boolean).
- Output: `wishlistToggle`, emits the product when the heart button is clicked.
- Heart button: `aria-pressed` = wishlisted, and `aria-label` =
  `Add <name> to wishlist` / `Remove <name> from wishlist`.
- Price shown with the `currency` pipe.

## Required `data-test-id`s

| id | where |
|---|---|
| `loading`, `error-message`, `retry-button` | page |
| `search-input`, `category-select`, `sort-select` | page |
| `product-item` | on each `<app-product-card>` element |
| `product-name`, `product-price`, `wishlist-toggle` | inside the card |
| `no-results`, `page-info`, `prev-button`, `next-button` | page |
| `wishlist-count` | page, just the number |
