import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutPageComponent } from './checkout-page';
import { PRODUCTS } from '../data/products';

describe('P2 CheckoutPageComponent', () => {
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let el: HTMLElement;

  const q = (id: string) => el.querySelector(`[data-test-id="${id}"]`) as HTMLElement;
  const text = (id: string) => q(id)?.textContent!.trim();
  const submitBtn = () => q('submit-button') as HTMLButtonElement;
  const lines = () =>
    Array.from(el.querySelectorAll('[data-test-id="cart-item"]')).map((li) => ({
      name: li.querySelector('[data-test-id="cart-item-name"]')!.textContent!.trim(),
      qty: li.querySelector('[data-test-id="cart-item-qty"]')!.textContent!.trim(),
    }));

  function add(index: number) {
    (el.querySelectorAll('[data-test-id="add-button"]')[index] as HTMLElement).click();
    fixture.detectChanges();
  }
  function clickInLine(line: number, id: string) {
    const li = el.querySelectorAll('[data-test-id="cart-item"]')[line];
    (li.querySelector(`[data-test-id="${id}"]`) as HTMLElement).click();
    fixture.detectChanges();
  }
  function type(id: string, value: string) {
    const input = q(id) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
  function blur(id: string) {
    q(id).dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }
  function fillValidForm() {
    type('name-input', 'Iris');
    type('email-input', 'iris@example.com');
    type('zip-input', '98101');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CheckoutPageComponent] }).compileComponents();
    fixture = TestBed.createComponent(CheckoutPageComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  // --- cart ----------------------------------------------------------------

  it('lists every product with an add button', () => {
    expect(el.querySelectorAll('[data-test-id="add-button"]').length).toBe(PRODUCTS.length);
  });

  it('starts with an empty cart', () => {
    expect(text('empty-cart')).toBe('Your cart is empty');
    expect(text('cart-count')).toBe('0');
    expect(text('cart-total')).toBe('$0.00');
  });

  it('adding the same product twice increases quantity, lines keep first-added order', () => {
    add(5);
    add(0);
    add(5);
    expect(lines()).toEqual([
      { name: 'Logitech Mouse', qty: '2' },
      { name: 'Sony Headphones', qty: '1' },
    ]);
    expect(q('empty-cart')).toBeNull();
  });

  it('computes count and total', () => {
    add(0); // 349
    add(0); // 349
    add(5); // 49
    expect(text('cart-count')).toBe('3');
    expect(text('cart-total')).toBe('$747.00');
  });

  it('+ and - change quantity, and - at 1 removes the line', () => {
    add(0);
    clickInLine(0, 'increase-button');
    expect(lines()[0].qty).toBe('2');
    clickInLine(0, 'decrease-button');
    clickInLine(0, 'decrease-button');
    expect(lines()).toEqual([]);
    expect(text('empty-cart')).toBe('Your cart is empty');
  });

  it('remove deletes the whole line', () => {
    add(0);
    add(0);
    add(1);
    clickInLine(0, 'remove-button');
    expect(lines()).toEqual([{ name: 'Bose Headphones', qty: '1' }]);
    expect(text('cart-total')).toBe('$299.00');
  });

  it('cart buttons have accessible labels naming the product', () => {
    add(0);
    const li = el.querySelector('[data-test-id="cart-item"]')!;
    expect(li.querySelector('[data-test-id="increase-button"]')!.getAttribute('aria-label')).toBe(
      'Increase quantity of Sony Headphones',
    );
    expect(li.querySelector('[data-test-id="decrease-button"]')!.getAttribute('aria-label')).toBe(
      'Decrease quantity of Sony Headphones',
    );
  });

  // --- form validation -----------------------------------------------------

  it('does not show errors before a field is touched', () => {
    expect(q('name-error')).toBeNull();
    expect(q('email-error')).toBeNull();
    expect(q('zip-error')).toBeNull();
  });

  it('name: required, then min length 2', () => {
    blur('name-input');
    expect(text('name-error')).toBe('Name is required');
    type('name-input', 'I');
    expect(text('name-error')).toBe('Name must be at least 2 characters');
    type('name-input', 'Iris');
    expect(q('name-error')).toBeNull();
  });

  it('email: required, then valid format', () => {
    blur('email-input');
    expect(text('email-error')).toBe('Email is required');
    type('email-input', 'not-an-email');
    expect(text('email-error')).toBe('Enter a valid email');
    type('email-input', 'a@b.com');
    expect(q('email-error')).toBeNull();
  });

  it('zip: exactly 5 digits', () => {
    type('zip-input', '98a01');
    blur('zip-input');
    expect(text('zip-error')).toBe('ZIP must be 5 digits');
    type('zip-input', '981011');
    expect(text('zip-error')).toBe('ZIP must be 5 digits');
    type('zip-input', '98101');
    expect(q('zip-error')).toBeNull();
  });

  // --- submit --------------------------------------------------------------

  it('submit is disabled when the form is invalid', () => {
    add(0);
    expect(submitBtn().disabled).toBe(true);
  });

  it('submit is disabled when the cart is empty, even with a valid form', () => {
    fillValidForm();
    expect(submitBtn().disabled).toBe(true);
    add(0);
    expect(submitBtn().disabled).toBe(false);
  });

  it('placing the order shows a summary, clears the cart and resets the form', () => {
    add(0);
    add(0);
    add(5);
    fillValidForm();
    submitBtn().click();
    fixture.detectChanges();

    expect(text('success-message')).toBe('Thanks, Iris! Order placed for 3 item(s). Total: $747.00');
    expect(lines()).toEqual([]);
    expect(text('cart-total')).toBe('$0.00');
    expect((q('name-input') as HTMLInputElement).value).toBe('');
    expect(submitBtn().disabled).toBe(true);
    expect(q('name-error')).toBeNull();
  });

  it('the success message disappears when a new item is added', () => {
    add(0);
    fillValidForm();
    submitBtn().click();
    fixture.detectChanges();
    add(1);
    expect(q('success-message')).toBeNull();
  });
});
