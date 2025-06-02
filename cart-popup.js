document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const popup = document.getElementById("cart-popup");
  const continueBtn = document.getElementById("continue-shopping");

  // Show popup when any "Add to Cart" button is clicked
  addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {
      popup.classList.remove("hidden");
    });
  });

  // Hide popup when "Continue Shopping" is clicked
  continueBtn.addEventListener("click", function () {
    popup.classList.add("hidden");
  });
});