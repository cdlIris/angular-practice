import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ShopPageComponent } from './shop-page';
import { ProductCardComponent } from './product-card';
import { ProductService } from './product.service';
import { PRODUCTS, Product } from '../data/products';

describe('P1 ProductService', () => {
  it('GETs /api/products', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    let result: Product[] | undefined;
    TestBed.inject(ProductService).getProducts().subscribe((p) => (result = p));
    const req = http.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(PRODUCTS);
    expect(result).toEqual(PRODUCTS);
    http.verify();
  });
});

describe('P1 ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let el: HTMLElement;
  const q = (id: string) => el.querySelector(`[data-test-id="${id}"]`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProductCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProductCardComponent);
    el = fixture.nativeElement;
    fixture.componentRef.setInput('product', PRODUCTS[0]);
    fixture.componentRef.setInput('wishlisted', false);
    fixture.detectChanges();
  });

  it('renders name and price from the product input', () => {
    expect(q('product-name').textContent!.trim()).toBe('Sony Headphones');
    expect(q('product-price').textContent!.trim()).toBe('$349.00');
  });

  it('heart button reflects the wishlisted input with aria-pressed and aria-label', () => {
    expect(q('wishlist-toggle').getAttribute('aria-pressed')).toBe('false');
    expect(q('wishlist-toggle').getAttribute('aria-label')).toBe('Add Sony Headphones to wishlist');
    fixture.componentRef.setInput('wishlisted', true);
    fixture.detectChanges();
    expect(q('wishlist-toggle').getAttribute('aria-pressed')).toBe('true');
    expect(q('wishlist-toggle').getAttribute('aria-label')).toBe('Remove Sony Headphones from wishlist');
  });

  it('emits the product through the wishlistToggle output', () => {
    let emitted: Product | undefined;
    fixture.componentInstance.wishlistToggle.subscribe((p: Product) => (emitted = p));
    q('wishlist-toggle').click();
    expect(emitted).toEqual(PRODUCTS[0]);
  });
});

describe('P1 ShopPageComponent', () => {
  let fixture: ComponentFixture<ShopPageComponent>;
  let el: HTMLElement;
  let http: HttpTestingController;

  const q = (id: string) => el.querySelector(`[data-test-id="${id}"]`) as HTMLElement;
  const text = (id: string) => q(id)?.textContent!.trim();
  const items = () => Array.from(el.querySelectorAll('[data-test-id="product-item"]')) as HTMLElement[];
  const names = () => items().map((i) => i.querySelector('[data-test-id="product-name"]')!.textContent!.trim());

  async function render() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function loadOk(data: Product[] = PRODUCTS) {
    http.expectOne('/api/products').flush(data);
    await render();
  }
  async function type(id: string, value: string) {
    const input = q(id) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await render();
  }
  async function choose(id: string, value: string) {
    const select = q(id) as HTMLSelectElement;
    select.value = value;
    select.dispatchEvent(new Event('change'));
    await render();
  }
  async function click(target: string | HTMLElement) {
    (typeof target === 'string' ? q(target) : target).click();
    await render();
  }
  const heart = (index: number) =>
    items()[index].querySelector('[data-test-id="wishlist-toggle"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ShopPageComponent);
    el = fixture.nativeElement;
    fixture.detectChanges(); // ngOnInit -> request
  });

  afterEach(() => http.verify());

  // --- loading / error / empty ---------------------------------------------

  it('shows loading, then the first page of products', async () => {
    expect(text('loading')).toBe('Loading...');
    expect(names()).toEqual([]);
    await loadOk();
    expect(q('loading')).toBeNull();
    expect(names()).toEqual(['Sony Headphones', 'Bose Headphones', 'Apple Laptop']);
  });

  it('shows an error with retry, and retry loads again', async () => {
    http.expectOne('/api/products').flush('boom', { status: 500, statusText: 'Server Error' });
    await render();
    expect(q('loading')).toBeNull();
    expect(text('error-message')).toBe('Failed to load products');

    await click('retry-button');
    expect(q('error-message')).toBeNull();
    expect(text('loading')).toBe('Loading...');

    await loadOk(PRODUCTS.slice(0, 1));
    expect(names()).toEqual(['Sony Headphones']);
  });

  it('shows "No products found" when the API returns nothing', async () => {
    await loadOk([]);
    expect(text('no-results')).toBe('No products found');
    expect(text('page-info')).toBe('Page 1 of 1');
  });

  // --- search / filter / sort ----------------------------------------------

  it('search is partial and case-insensitive', async () => {
    await loadOk();
    await type('search-input', 'SONY');
    expect(names()).toEqual(['Sony Headphones', 'Sony Speaker']);
  });

  it('category dropdown lists All plus each category once', async () => {
    await loadOk();
    const options = Array.from((q('category-select') as HTMLSelectElement).options).map((o) =>
      o.textContent!.trim(),
    );
    expect(options).toEqual(['All', 'audio', 'computers', 'accessories']);
  });

  it('search and category combine', async () => {
    await loadOk();
    await choose('category-select', 'audio');
    await type('search-input', 'headphones');
    expect(names()).toEqual(['Sony Headphones', 'Bose Headphones']);
    await type('search-input', 'xyz');
    expect(text('no-results')).toBe('No products found');
  });

  it('sorts by price and rating without mutating the original order', async () => {
    await loadOk();
    await choose('sort-select', 'price-asc');
    expect(names()).toEqual(['Logitech Mouse', 'Keychron Keyboard', 'Sony Speaker']);
    await choose('sort-select', 'price-desc');
    expect(names()).toEqual(['Apple Laptop', 'Dell Laptop', 'Samsung Monitor']);
    await choose('sort-select', 'rating-desc');
    expect(names()).toEqual(['Apple Laptop', 'Sony Headphones', 'Logitech Mouse']);
    await choose('sort-select', '');
    expect(names()).toEqual(['Sony Headphones', 'Bose Headphones', 'Apple Laptop']);
  });

  // --- pagination ----------------------------------------------------------

  it('paginates 3 per page with disabled prev/next at the ends', async () => {
    await loadOk();
    expect(text('page-info')).toBe('Page 1 of 3');
    expect((q('prev-button') as HTMLButtonElement).disabled).toBe(true);
    await click('next-button');
    await click('next-button');
    expect(names()).toEqual(['Keychron Keyboard', 'Samsung Monitor']);
    expect((q('next-button') as HTMLButtonElement).disabled).toBe(true);
    await click('prev-button');
    expect(text('page-info')).toBe('Page 2 of 3');
  });

  it('goes back to page 1 when search, category or sort changes', async () => {
    await loadOk();
    await click('next-button');
    await type('search-input', 'o');
    expect(text('page-info')).toBe('Page 1 of 3');
    await click('next-button');
    await choose('category-select', 'computers');
    expect(text('page-info')).toBe('Page 1 of 1');
    await choose('category-select', '');
    await click('next-button');
    await choose('sort-select', 'price-asc');
    expect(text('page-info')).toBe('Page 1 of 3');
  });

  // --- wishlist ------------------------------------------------------------

  it('toggles the wishlist through the card and updates the count', async () => {
    await loadOk();
    expect(text('wishlist-count')).toBe('0');
    await click(heart(0));
    await click(heart(2));
    expect(text('wishlist-count')).toBe('2');
    expect(heart(0).getAttribute('aria-pressed')).toBe('true');
    await click(heart(0));
    expect(heart(0).getAttribute('aria-pressed')).toBe('false');
    expect(text('wishlist-count')).toBe('1');
  });

  it('wishlist survives searching and paging', async () => {
    await loadOk();
    await click(heart(1)); // Bose Headphones
    await type('search-input', 'bose');
    expect(heart(0).getAttribute('aria-pressed')).toBe('true');
    await type('search-input', '');
    await click('next-button');
    await click('prev-button');
    expect(heart(1).getAttribute('aria-pressed')).toBe('true');
  });

  // --- accessibility -------------------------------------------------------

  it('search input has an accessible label', async () => {
    await loadOk();
    const input = q('search-input') as HTMLInputElement;
    const labelled =
      !!input.getAttribute('aria-label') ||
      (!!input.id && !!el.querySelector(`label[for="${input.id}"]`)) ||
      !!input.closest('label');
    expect(labelled).toBe(true);
  });
});
