
// cart-backend.js

// ------------------------------
// Product Data (Mock Database)
// ------------------------------
const productCatalog = {
    "miffy": { name: "Miffy Teddy Pink 23cm", price: 39.95 },
    "pikachu": { name: "Nanoblock Pokémon – Pikachu", price: 17.99 },
    "rainbow-lion": { name: "Grimm’s – Building Set Rainbow Lion", price: 299.00 },
    "grapat": { name: "Grapat – Together", price: 94.95 }
};

// ------------------------------
// Cart Data Structure
// ------------------------------
let cart = {};

// ------------------------------
// Add to Cart
// ------------------------------
function addToCart(productId) {
    if (!cart[productId]) {
        cart[productId] = { quantity: 0 };
    }
    cart[productId].quantity += 1;
    updateCartDisplay();
}

// ------------------------------
// Update Quantity
// ------------------------------
function updateQuantity(productId, change) {
    if (!cart[productId]) return;
    cart[productId].quantity += change;
    if (cart[productId].quantity <= 0) {
        delete cart[productId];
    }
    updateCartDisplay();
}

// ------------------------------
// Get Total Price for a Product
// ------------------------------
function getProductTotal(productId) {
    const item = cart[productId];
    if (!item) return 0;
    return (productCatalog[productId].price * item.quantity).toFixed(2);
}

// ------------------------------
// Update Cart Display Placeholder
// ------------------------------
function updateCartDisplay() {
    console.log("Current cart:");
    for (let id in cart) {
        console.log(`- ${productCatalog[id].name}: Quantity = ${cart[id].quantity}, Total = $${getProductTotal(id)}`);
    }
}

// ------------------------------
// DOM Hook for + and - buttons
// ------------------------------
function setupQtyButtons(productId) {
    const minusBtn = document.querySelector(`#${productId}-minus`);
    const plusBtn = document.querySelector(`#${productId}-plus`);
    if (minusBtn) {
        minusBtn.addEventListener('click', () => updateQuantity(productId, -1));
    }
    if (plusBtn) {
        plusBtn.addEventListener('click', () => updateQuantity(productId, 1));
    }
}

// ------------------------------
// Example: Call setup for all four products
// ------------------------------
window.addEventListener("DOMContentLoaded", () => {
    setupQtyButtons("miffy");
    setupQtyButtons("pikachu");
    setupQtyButtons("rainbow-lion");
    setupQtyButtons("grapat");
});
