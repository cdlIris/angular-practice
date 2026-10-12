# P2 — Cart + Checkout (40 min)

A product list with "Add to cart", a cart, and a checkout form.
Covers: array add/update/remove, `reduce`, `currency` pipe, Reactive Forms + Validators,
conditional error messages, combined disable rules, resetting state, accessibility.

Suggested order (run `npm run test:p2` after each step):
1. Product list + add to cart + cart lines + count/total
2. +/-/remove
3. Reactive form + validation messages
4. Submit

## Cart
1. List every product with an `Add to cart` button.
2. Adding a product creates a line with quantity 1; adding it again increases the quantity (no duplicate line).
   Lines keep the order products were **first** added.
3. Each line: `-`, quantity, `+`, `Remove`. Decreasing to 0 removes the line.
   `+`/`-` buttons need `aria-label` = `Increase quantity of <name>` / `Decrease quantity of <name>`.
4. Show the item count (sum of quantities) and the total with the `currency` pipe (e.g. `$747.00`).
5. Empty cart shows `Your cart is empty`.

## Checkout form (Reactive Forms)

| field | rules | error text |
|---|---|---|
| name | required, min 2 chars | `Name is required` / `Name must be at least 2 characters` |
| email | required, valid email | `Email is required` / `Enter a valid email` |
| zip | required, exactly 5 digits | `ZIP must be 5 digits` |

6. Show an error only after the field is touched (blurred) or edited; only render the error element when there is an error.
7. `Place order` is disabled unless the form is valid **and** the cart is not empty.
8. On submit:
   - show `Thanks, <name>! Order placed for <count> item(s). Total: <total>` (e.g. `... Total: $747.00`)
   - clear the cart and reset the form (no errors showing, button disabled again).
9. Adding an item after a successful order hides the success message.

## Required `data-test-id`s

| id | where |
|---|---|
| `add-button` | one per product |
| `cart-item` | one per cart line |
| `cart-item-name`, `cart-item-qty`, `increase-button`, `decrease-button`, `remove-button` | inside `cart-item` |
| `cart-count`, `cart-total`, `empty-cart` | cart |
| `name-input`, `email-input`, `zip-input` | form |
| `name-error`, `email-error`, `zip-error` | form |
| `submit-button`, `success-message` | form |
