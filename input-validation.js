document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirm-btn');
    const payNowBtn = document.getElementById('pay-now-btn');

    const isConfirmationPage = payNowBtn !== null;
    const isFormPage = confirmBtn !== null;

    // --- UTILITY FUNCTIONS ---

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

    function clearError(input) {
        input.classList.remove('invalid');
        const nextSibling = input.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('error-message')) {
            nextSibling.remove();
        }
    }

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

    // --- STORAGE FUNCTIONS ---

    function storeInputsForPage(storageKey) {
        const inputs = document.querySelectorAll('input');
        const data = {};
        inputs.forEach(input => {
            if (input.name) {
                data[input.name] = input.value;
            }
        });
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    function loadInputsForPage(storageKey) {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return;
        const data = JSON.parse(saved);
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.name && data.hasOwnProperty(input.name)) {
                input.value = data[input.name];
            }
        });
    }

    function attachAutoSave(storageKey) {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                storeInputsForPage(storageKey);
            });
        });
    }

    // --- PAGE-SPECIFIC INIT ---

    if (isFormPage) {
        loadInputsForPage('checkoutFormData');
        attachAutoSave('checkoutFormData');
    }

    if (isConfirmationPage) {
        loadInputsForPage('checkoutPaymentData');
        attachAutoSave('checkoutPaymentData');
    }

    // --- VALIDATION AND NAVIGATION ---

    function setupValidation(button, nextPageHref, currentPageStorageKey) {
        if (!button) return;

        button.addEventListener('click', (e) => {
            const valid = validateRequiredInputs();
            if (!valid) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                storeInputsForPage(currentPageStorageKey);
                if (nextPageHref) {
                    e.preventDefault();
                    window.location.href = nextPageHref;
                }
            }
        });
    }

    setupValidation(confirmBtn, 'Checkout-confirmation.html', 'checkoutFormData');
    setupValidation(payNowBtn, 'Checkout-success.html', 'checkoutPaymentData');
});
