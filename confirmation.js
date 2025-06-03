document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const totalFromStorage = parseFloat(localStorage.getItem('cart_total')) || 0;
  const tbody = document.getElementById('order-items');
  const finalTotalEl = document.querySelector('.final-total');

  let subtotal = 0;

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

  finalTotalEl.innerText = '$' + subtotal.toFixed(2);
  localStorage.setItem('confirmation_subtotal', subtotal.toFixed(2)); // optional

  // Handle shipping change
  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener('change', () => {
      let finalTotal = subtotal;
      if (radio.value === 'flat') finalTotal += 10;
      finalTotalEl.innerText = '$' + finalTotal.toFixed(2);
    });
  });
});