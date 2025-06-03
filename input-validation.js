
document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirm-btn');
    const payNowBtn = document.getElementById('pay-now-btn');

    // Utility to show error after input
    function showError(input, message) {
        input.classList.add('invalid');

        const nextSibling = input.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('error-message')) {
            nextSibling.remove();
        }

        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        input.insertAdjacentElement('afterend', error);
    }

    // Utility to clear error
    function clearError(input) {
        input.classList.remove('invalid');
        const nextSibling = input.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('error-message')) {
            nextSibling.remove();
        }
    }

    // Validate all required inputs on the page
    function validateRequiredInputs() {
        let isValid = true;
        const requiredInputs = document.querySelectorAll('.required-field');

        requiredInputs.forEach(input => {
            const isEmpty = input.value.trim() === '';
            if (isEmpty) {
                showError(input, 'This field is required.');
                isValid = false;
            } else {
                clearError(input);
            }
        });

        return isValid;
    }

    // Save form input to localStorage
    function storeFormInputs() {
        const inputs = document.querySelectorAll('input');
        const data = {};
        inputs.forEach(input => {
            data[input.name] = input.value;
        });
        localStorage.setItem('formInputs', JSON.stringify(data));
    }

    // Load form input from localStorage
    function loadFormInputs() {
        const saved = localStorage.getItem('formInputs');
        if (saved) {
            const data = JSON.parse(saved);
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                if (data[input.name]) {
                    input.value = data[input.name];
                }
            });
        }
    }

    // Listen to input changes and store
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', storeFormInputs);
    });

    loadFormInputs();

    // Setup button validation
    function setupValidation(button, nextPageHref) {
        if (!button) return;

        button.addEventListener('click', (e) => {
            const valid = validateRequiredInputs();
            if (!valid) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (nextPageHref) {
                e.preventDefault();
                storeFormInputs();
                window.location.href = nextPageHref;
            }
        });
    }

    // Attach validation with redirect targets
    setupValidation(confirmBtn, 'Checkout-confirmation.html');
    setupValidation(payNowBtn, 'Checkout-success.html');
});
