document.addEventListener('DOMContentLoaded', function () {
    const cardScene = document.querySelector('.card-scene');
    const cardFlip = document.getElementById('cardFlip');
    const paymentForm = document.getElementById('paymentForm');
    const successView = document.getElementById('successView');
    const tempAlert = document.getElementById('tempAlert'); 
    const homeButton = document.getElementById('homeButton');

    const cardNumDisplay = document.getElementById('cardNumDisplay');
    const cardNameDisplay = document.getElementById('cardNameDisplay');
    const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');
    const cardCVVDisplay = document.getElementById('cardCVVDisplay');

    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCVVInput = document.getElementById('cardCVV');

    function generateRandomNumber() {
        let number = '';
        for (let i = 0; i < 16; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number;
    }

    function generateRandomDateAndCVV() {
        const today = new Date();
        const currentYear = today.getFullYear() % 100;
        
        const randomMonth = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
        
        const randomYearOffset = Math.floor(Math.random() * 5) + 1;
        const randomYear = (currentYear + randomYearOffset).toString();
        
        const expiryDate = `${randomMonth}/${randomYear}`;
        
        const cvv = Math.floor(Math.random() * 900) + 100; // Rango 100-999

        return {
            expiry: expiryDate,
            cvv: cvv.toString()
        };
    }

    function formatCardNumber(value) {
        const cleanValue = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        let formatted = cleanValue.replace(/(\d{4})/g, '$1 ').trim();
        return formatted;
    }

    function updateCardNumberDisplay(value) {
        const cleanValue = value.replace(/\s/g, '').substring(0, 16);
        const formatted = formatCardNumber(cleanValue);

        let displayHTML = formatted.split(' ').map(block =>
            `<span>${block.padEnd(4, '#')}</span>`
        ).join(' ');

        if (cleanValue.length === 0) {
            displayHTML = `<span>####</span> <span>####</span> <span>####</span> <span>####</span>`;
        }
        cardNumDisplay.innerHTML = displayHTML;
    }

    function updateCardNameDisplay(value) {
        cardNameDisplay.textContent = value.toUpperCase() || 'NOMBRE TITULAR';
    }

    function updateCardExpiryDisplay(value) {
        let cleanValue = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        if (cleanValue.length > 2) {
            cleanValue = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
        }

        let displayValue;
        if (cleanValue.length === 0) {
            displayValue = 'MM/AA';
        } else if (cleanValue.length > 2 && cleanValue.indexOf('/') > -1) {
            displayValue = cleanValue.substring(0, 3) + cleanValue.substring(3, 5).padEnd(2, 'A');
        } else {
            displayValue = cleanValue.padEnd(2, 'M') + '/AA';
        }
        cardExpiryDisplay.textContent = displayValue;
    }

    function updateCardCVVDisplay(value) {
        const cleanValue = value.replace(/[^0-9]/g, '').substring(0, 4);
        const stars = cleanValue.replace(/./g, '*');
        cardCVVDisplay.textContent = stars.padEnd(3, '*');
    }

    function saveCardData() {
        sessionStorage.setItem('cardNumber', cardNumberInput.value);
        sessionStorage.setItem('cardName', cardNameInput.value);
        sessionStorage.setItem('cardExpiry', cardExpiryInput.value);
        sessionStorage.setItem('cardCVV', cardCVVInput.value);
        sessionStorage.setItem('cardDataSaved', 'true'); 
    }

    function loadCardData() {
        let savedNumber = sessionStorage.getItem('cardNumber') || '';
        const savedName = sessionStorage.getItem('cardName') || '';
        let savedExpiry = sessionStorage.getItem('cardExpiry') || '';
        let savedCVV = sessionStorage.getItem('cardCVV') || '';
        const isDataSaved = sessionStorage.getItem('cardDataSaved') === 'true';

        if (!isDataSaved) {
            const randomData = generateRandomDateAndCVV();
            
            savedNumber = generateRandomNumber();
            savedExpiry = randomData.expiry;
            savedCVV = randomData.cvv;
        }

        cardNumberInput.value = savedNumber;
        cardNameInput.value = savedName; 
        cardExpiryInput.value = savedExpiry;
        cardCVVInput.value = savedCVV;

        // Refrescar la tarjeta visual
        updateCardNumberDisplay(savedNumber);
        updateCardNameDisplay(savedName);
        updateCardExpiryDisplay(savedExpiry);
        updateCardCVVDisplay(savedCVV);

        if (isDataSaved) {
            paymentForm.style.display = 'none';
            successView.style.display = 'block';
        } else {
            paymentForm.style.display = 'block';
            successView.style.display = 'none';
        }
    }

    loadCardData();

    cardScene.addEventListener('click', function () {
        cardFlip.classList.toggle('rotated');
    });

    cardNumberInput.addEventListener('input', function () {
        this.value = formatCardNumber(this.value);
        updateCardNumberDisplay(this.value);
        saveCardData();
    });

    cardNameInput.addEventListener('input', function () {
        updateCardNameDisplay(this.value);
        saveCardData();
    });

    cardExpiryInput.addEventListener('input', function () {
        let value = this.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        this.value = value.substring(0, 5);
        updateCardExpiryDisplay(this.value);
        saveCardData();
    });

    cardCVVInput.addEventListener('input', function () {
        const cleanValue = this.value.replace(/[^0-9]/g, '').substring(0, 4);
        this.value = cleanValue;
        updateCardCVVDisplay(this.value);
        saveCardData();

        if (document.activeElement === this) {
            cardFlip.classList.add('rotated');
        }
    });

    cardCVVInput.addEventListener('blur', function () {
        cardFlip.classList.remove('rotated');
    });

    homeButton.addEventListener('click', function () {
        window.location.href = '/Necli-main/pages/home.html';
    });

    paymentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        saveCardData();

        paymentForm.style.display = 'none';
        tempAlert.style.display = 'block';

        setTimeout(() => {
            tempAlert.style.display = 'none';

            successView.style.display = 'block';

        }, 2000);
    });
});