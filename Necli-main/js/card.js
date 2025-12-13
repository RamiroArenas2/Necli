document.addEventListener('DOMContentLoaded', function () {
    // 1. Referencias a los contenedores y elementos
    const cardScene = document.querySelector('.card-scene');
    const cardFlip = document.getElementById('cardFlip');
    const paymentForm = document.getElementById('paymentForm');
    const successView = document.getElementById('successView');
    const tempAlert = document.getElementById('tempAlert'); 
    const homeButton = document.getElementById('homeButton');

    // Referencias a los displays de la tarjeta
    const cardNumDisplay = document.getElementById('cardNumDisplay');
    const cardNameDisplay = document.getElementById('cardNameDisplay');
    const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');
    const cardCVVDisplay = document.getElementById('cardCVVDisplay');

    // Referencias a los campos de entrada del formulario
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCVVInput = document.getElementById('cardCVV');


    // 2. Funciones de Ayuda y Display
    
    function generateRandomNumber() {
        // Genera un número de tarjeta de 16 dígitos aleatorios
        let number = '';
        for (let i = 0; i < 16; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number;
    }

    function generateRandomDateAndCVV() {
        const today = new Date();
        const currentYear = today.getFullYear() % 100;
        
        // Generar un mes aleatorio (01 a 12)
        const randomMonth = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
        
        // Generar un año aleatorio (del actual + 1 al actual + 5)
        const randomYearOffset = Math.floor(Math.random() * 5) + 1;
        const randomYear = (currentYear + randomYearOffset).toString();
        
        const expiryDate = `${randomMonth}/${randomYear}`;
        
        // Generar CVV aleatorio de 3 dígitos
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

    // 3. Lógica de Almacenamiento (sessionStorage)

    function saveCardData() {
        sessionStorage.setItem('cardNumber', cardNumberInput.value);
        sessionStorage.setItem('cardName', cardNameInput.value);
        sessionStorage.setItem('cardExpiry', cardExpiryInput.value);
        sessionStorage.setItem('cardCVV', cardCVVInput.value);
        sessionStorage.setItem('cardDataSaved', 'true'); 
    }

    function loadCardData() {
        let savedNumber = sessionStorage.getItem('cardNumber') || '';
        const savedName = sessionStorage.getItem('cardName') || ''; // Se carga si existe, si no, queda vacío.
        let savedExpiry = sessionStorage.getItem('cardExpiry') || '';
        let savedCVV = sessionStorage.getItem('cardCVV') || '';
        const isDataSaved = sessionStorage.getItem('cardDataSaved') === 'true';

        if (!isDataSaved) {
            const randomData = generateRandomDateAndCVV();
            
            savedNumber = generateRandomNumber();
            savedExpiry = randomData.expiry;
            savedCVV = randomData.cvv;
            // savedName se mantiene vacío (o lo que sea el || '') para que el usuario escriba.
        }

        // Aplicar los datos a los inputs 
        cardNumberInput.value = savedNumber;
        cardNameInput.value = savedName; 
        cardExpiryInput.value = savedExpiry;
        cardCVVInput.value = savedCVV;

        // Refrescar la tarjeta visual
        updateCardNumberDisplay(savedNumber);
        updateCardNameDisplay(savedName);
        updateCardExpiryDisplay(savedExpiry);
        updateCardCVVDisplay(savedCVV);

        // LÓGICA DE VISUALIZACIÓN INICIAL
        if (isDataSaved) {
            paymentForm.style.display = 'none';
            successView.style.display = 'block';
        } else {
            paymentForm.style.display = 'block';
            successView.style.display = 'none';
        }
    }


    // 4. Event Listeners y Lógica Principal

    // Cargar datos al iniciar
    loadCardData();

    // Rotación al hacer clic
    cardScene.addEventListener('click', function () {
        cardFlip.classList.toggle('rotated');
    });

    // Actualizar y GUARDAR datos cada vez que hay un input
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

    // Redirección del botón Home
    homeButton.addEventListener('click', function () {
        window.location.href = '/Necli-main/pages/home.html';
    });


    // 5. Lógica de Envío del Formulario (Secuencia Temporal)
    paymentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Guardar los datos finales y asegurar la bandera de guardado
        saveCardData();

        // 2. Ocultar el formulario y mostrar la alerta temporal
        paymentForm.style.display = 'none';
        tempAlert.style.display = 'block';

        // 3. Esperar 2 segundos
        setTimeout(() => {
            tempAlert.style.display = 'none'; // Oculta la alerta temporal

            // 4. Mostrar la vista de éxito final (Tarjeta estática + Botón Home)
            successView.style.display = 'block';

        }, 2000); // Muestra la alerta por 2 segundos
    });
});