// Initialize cart from localStorage or as empty
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart with specified quantity
function addToCart(name, price, qty = 1) {
    if (cart[name]) {
        cart[name].quantity += qty;
    } else {
        cart[name] = {
            price: price,
            quantity: qty
        };
    }
    saveCart();
}

// Handle Add to Cart buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const productSection = btn.closest('.product-card') || btn.closest('.product-detail');
            if (!productSection) {
                console.warn('No product section found for button', btn);
                return;
            }

            const nameElement = productSection.querySelector('.product-name') ||
                                productSection.querySelector('h1') ||
                                productSection.querySelector('a .product-name');
            const priceElement = productSection.querySelector('.price') ||
                                 productSection.querySelector('a .price');
            const quantityInput = productSection.querySelector('input[type="number"]');

            if (!nameElement || !priceElement) {
                console.warn('Missing name or price:', { nameElement, priceElement });
                return;
            }

            const pName = nameElement.innerText.trim();
            const priceText = priceElement.childNodes[0]?.nodeValue.trim() || '';
            const tPrice = parseFloat(priceText.replace('$', ''));

            const qty = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;

            addToCart(pName, tPrice, qty);

            const popup = document.getElementById('cart-popup');
            if (popup) popup.classList.remove('hidden');
        });
    });
});

// Update UI on quantity increase via quantity button (single product page)
function increaseQty(button) {
    const container = button.closest('.quantity-selector');
    const input = container.querySelector('.quantity');
    input.value = parseInt(input.value, 10) + 1;
}

// Update UI on quantity decrease via quantity button (single product page)
function decreaseQty(button) {
    const container = button.closest('.quantity-selector');
    const input = container.querySelector('.quantity');
    const current = parseInt(input.value, 10);
    if (current > 1) input.value = current - 1;
}

// Clear entire cart
function clearCart() {
    cart = {};
    localStorage.removeItem('cart');
    console.log('Cart cleared');
}

// Close popup on Continue Shopping
document.querySelectorAll('.popup-btn.yellow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const popup = document.getElementById('cart-popup');
        if (popup) popup.classList.add('hidden');
    });
});

// Render cart items on cart.html
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartEmptyText = document.querySelector('.cart-empty');
    const subtotalEl = document.querySelector('.subtotal');
    const totalEl = document.querySelector('.total');

    let subtotal = 0;

    cartItems.forEach(item => {
        const name = item.querySelector('h2')?.innerText.trim();
        const priceText = item.querySelector('.price')?.innerText || '';
        const price = parseFloat(priceText.replace('Price: $', ''));
        const qtyInput = item.querySelector('.quantity');
        const totalDisplay = item.querySelector('.item-total');
        const deleteBtn = item.querySelector('.remove-item img');

        // If the product is not in the cart object, hide the item
        if (!name || !(name in cart)) {
            item.style.display = 'none';
            return;
        }

        // Set the quantity input and item total price
        const quantity = cart[name].quantity;
        qtyInput.value = quantity;
        const total = (price * quantity).toFixed(2);
        totalDisplay.innerText = 'Total: $' + total;
        subtotal += parseFloat(total);

        // Update quantity (decrement)
        item.querySelector('.qty-btn:nth-child(1)').onclick = () => {
            if (cart[name].quantity > 1) {
                cart[name].quantity--;
                qtyInput.value = cart[name].quantity;
                updateCartItem(name, price, item);
            }
        };

        // Update quantity (increment)
        item.querySelector('.qty-btn:nth-child(3)').onclick = () => {
            cart[name].quantity++;
            qtyInput.value = cart[name].quantity;
            updateCartItem(name, price, item);
        };

        // Handle product deletion
        deleteBtn.onclick = () => {
            delete cart[name];
            item.remove();
            saveCart();
            location.reload();
        };
    });

    // Display updated subtotal and total in the cart summary
    if (subtotalEl) subtotalEl.innerText = '$' + subtotal.toFixed(2);
    if (totalEl) totalEl.innerText = '$' + subtotal.toFixed(2);

    // Check if cart is empty
    const activeItems = [...cartItems].filter(item => item.style.display !== 'none');
    if (activeItems.length === 0) {
        document.querySelectorAll('.cart-item, .cart-summary, .btn-group').forEach(el => el.style.display = 'none');
        if (cartEmptyText) cartEmptyText.style.display = 'block';
    }

    // Listen for shipping method changes to recalculate total
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updateShippingCost);
    });

    updateShippingCost(); // Initial total computation
});

// Check if the cart is empty, and visually disable cart layout and checkout if so
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-items-container');
    const cartEmptyText = document.querySelector('.cart-empty-text');
    const subtotalEl = document.querySelector('.subtotal');
    const totalEl = document.querySelector('.total');

    function checkEmptyCart() {
        const isEmpty = Object.keys(cart).length === 0;

        if (isEmpty) {
            // Hide item containers and cart summary
            document.querySelectorAll('.cart-item, .cart-summary, .btn-group').forEach(el => el.style.display = 'none');

            // Display empty cart text
            if (cartEmptyText) cartEmptyText.style.display = 'block';

            // Disable the <a> checkout button so user can't proceed
            const checkoutBtn = document.querySelector('.checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.classList.add('disabled');
                checkoutBtn.style.pointerEvents = 'none';
                checkoutBtn.style.opacity = '0.5';
                checkoutBtn.style.cursor = 'not-allowed';
            }
        }
    }

    checkEmptyCart(); // Run the function immediately when page loads
});

// Recalculate individual item total and overall cart subtotal
function updateCartItem(name, price, item) {
    const qty = cart[name].quantity;
    const total = (qty * price).toFixed(2);
    item.querySelector('.item-total').innerText = 'Total: $' + total;
    saveCart();
    recalculateTotals();
}

// Recalculate subtotal and total with shipping cost
function recalculateTotals() {
    let subtotal = 0;

    document.querySelectorAll('.cart-item').forEach(item => {
        const name = item.querySelector('h2')?.innerText.trim();

        if (!name || !cart[name]) {
            return; // skip items not in cart
        }

        const quantity = cart[name].quantity;
        const price = cart[name].price;
        const itemTotal = price * quantity;

        // Update item's total display
        const totalDisplay = item.querySelector('.item-total');
        if (totalDisplay) {
            totalDisplay.innerText = 'Total: $' + itemTotal.toFixed(2);
        }

        subtotal += itemTotal;
    });

    document.querySelector('.subtotal').innerText = '$' + subtotal.toFixed(2);
    localStorage.setItem('cart_subtotal', subtotal.toFixed(2));
    updateShippingCost();
}

// Apply shipping method and update total price
function updateShippingCost() {
    const subtotal = parseFloat(document.querySelector('.subtotal').innerText.replace('$', '')) || 0;
    const shippingMethod = document.querySelector('input[name="shipping"]:checked');
    let total = subtotal;
    if (shippingMethod && shippingMethod.value === 'flat') {
        total += 10;
    }
    document.querySelector('.total').innerText = '$' + total.toFixed(2);
    localStorage.setItem('cart_total', total.toFixed(2));
}
