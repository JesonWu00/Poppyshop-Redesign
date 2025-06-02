// Initialize cart from localStorage or as empty
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
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

// Quantity buttons for single product page
function increaseQty(button) {
    const container = button.closest('.quantity-selector');
    const input = container.querySelector('.quantity');
    input.value = parseInt(input.value, 10) + 1;
}

function decreaseQty(button) {
    const container = button.closest('.quantity-selector');
    const input = container.querySelector('.quantity');
    const current = parseInt(input.value, 10);
    if (current > 1) input.value = current - 1;
}

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

        if (!name || !(name in cart)) {
            item.style.display = 'none';
            return;
        }

        // Populate quantity and total
        const quantity = cart[name].quantity;
        qtyInput.value = quantity;
        const total = (price * quantity).toFixed(2);
        totalDisplay.innerText = 'Total: $' + total;
        subtotal += parseFloat(total);

        // Live update quantity
        item.querySelector('.qty-btn:nth-child(1)').onclick = () => {
            if (cart[name].quantity > 1) {
                cart[name].quantity--;
                qtyInput.value = cart[name].quantity;
                updateCartItem(name, price, item);
            }
        };

        item.querySelector('.qty-btn:nth-child(3)').onclick = () => {
            cart[name].quantity++;
            qtyInput.value = cart[name].quantity;
            updateCartItem(name, price, item);
        };

        // Delete item
        deleteBtn.onclick = () => {
            delete cart[name];
            item.remove();
            saveCart();
            location.reload();
        };
    });

    // Update totals
    if (subtotalEl) subtotalEl.innerText = '$' + subtotal.toFixed(2);
    if (totalEl) totalEl.innerText = '$' + subtotal.toFixed(2);

    // Check if cart is empty
    const activeItems = [...cartItems].filter(item => item.style.display !== 'none');
    if (activeItems.length === 0) {
        document.querySelectorAll('.cart-item, .cart-summary, .btn-group').forEach(el => el.style.display = 'none');
        if (cartEmptyText) cartEmptyText.style.display = 'block';
    }

    // Add shipping listeners
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updateShippingCost);
    });

    updateShippingCost();
});

// Quantity buttons for single product page
function increaseQty(button) {
    const container = button.closest('.quantity-selector');
    const input = container.querySelector('.quantity');
    input.value = parseInt(input.value, 10) + 1;
}

function decreaseQty(button) {
    const container = button.closest('.quantity-selector');
    const input = container.querySelector('.quantity');
    const current = parseInt(input.value, 10);
    if (current > 1) input.value = current - 1;
}

function updateCartItem(name, price, item) {
    const qty = cart[name].quantity;
    const total = (qty * price).toFixed(2);
    item.querySelector('.item-total').innerText = 'Total: $' + total;
    saveCart();
    recalculateTotals();
}

function recalculateTotals() {
    let subtotal = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const totalText = item.querySelector('.item-total')?.innerText || '';
        const price = parseFloat(totalText.replace('Total: $', ''));
        if (!isNaN(price)) subtotal += price;
    });
    document.querySelector('.subtotal').innerText = '$' + subtotal.toFixed(2);
    updateShippingCost();
}

function updateShippingCost() {
    const subtotal = parseFloat(document.querySelector('.subtotal').innerText.replace('$', '')) || 0;
    const shippingMethod = document.querySelector('input[name="shipping"]:checked');
    let total = subtotal;
    if (shippingMethod && shippingMethod.value === 'flat') {
        total += 10;
    }
    document.querySelector('.total').innerText = '$' + total.toFixed(2);
}