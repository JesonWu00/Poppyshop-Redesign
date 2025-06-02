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
function increaseQty() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value, 10) + 1;
}

function decreaseQty() {
    const input = document.getElementById('quantity');
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
