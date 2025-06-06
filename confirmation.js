document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const tbody = document.getElementById('order-items');
  const finalTotalEl = document.querySelector('.final-total');

  let subtotal = 0;

  // Display each product row and compute subtotal
  for (const [name, data] of Object.entries(cart)) {
    const itemTotal = (data.price * data.quantity).toFixed(2);
    subtotal += parseFloat(itemTotal);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        ${name}<br>
        Quantity: ${data.quantity}
      </td>
      <td>$${itemTotal}</td>
    `;
    tbody.appendChild(row);
  }

  localStorage.setItem('confirmation_subtotal', subtotal.toFixed(2));

  // Update total price based on selected shipping method
  function updateShippingTotal() {
    let finalTotal = subtotal;
    const selected = document.querySelector('input[name="shipping"]:checked');
    if (selected && selected.id === 'ship-flat') {
      finalTotal += 10;
    }
    finalTotalEl.textContent = '$' + finalTotal.toFixed(2);
  }

  // Initialize total and re-compute on shipping change
  updateShippingTotal();
  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      let finalTotal = subtotal;
      if (e.target.value === 'flat') {
        finalTotal += 10;
      }
      finalTotalEl.textContent = '$' + finalTotal.toFixed(2);
    });
  });

  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener('change', updateShippingTotal);
  });
  
  updateShippingTotal();
});
