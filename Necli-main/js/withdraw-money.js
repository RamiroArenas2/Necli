document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('withdrawForm');
    const amountInput = document.getElementById('amount');
    const methodSelect = document.getElementById('method');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const submitButton = form.querySelector('button[type="submit"]');

    // REFERENCIAS CLAVE del HTML
    const withdrawContainer = document.getElementById('withdrawContainer');
    const confirmationScreen = document.getElementById('confirmationScreen');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const homeButton = document.getElementById('homeButton'); 
    
    // Datos de simulación y mapeo
    const minimumAmount = 10000;
    const stepAmount = 5000;
    const availableBalance = 50000000; 
    
    const methodMap = {
        'necli_atm': 'Corresponsal Necli (Red Aliada)',
        'bancolombia': 'Corresponsal Bancolombia (A la Mano)',
        'other_bank': 'Transferencia bancaria'
    };

    function showFeedback(message, isError = false) {
        feedbackMessage.textContent = message;
        feedbackMessage.style.color = isError ? '#ff4d4d' : '#00e676';
        setTimeout(() => { 
            if (feedbackMessage.textContent === message) {
                feedbackMessage.textContent = '';
            }
        }, 5000); 
    }

    // FUNCIÓN: Muestra la pantalla de confirmación y oculta el formulario
    function showConfirmation(amount, method) {
        const designatedMethod = methodMap[method];
        
        confirmationMessage.innerHTML = `
            Tu solicitud de retiro de $${amount.toLocaleString()} fue procesada. <br><br>
            Se enviará un código e información detallada a tu número de teléfono y/o correo electrónico para que puedas retirar el dinero en: ${designatedMethod}.
        `;
        
        withdrawContainer.style.display = 'none';
        confirmationScreen.style.display = 'flex'; 
    }

    // EVENTO CLAVE: REDIRECCIÓN A HOME 
    homeButton.addEventListener('click', () => {
        window.location.href = 'home.html'; 
    });


    // LÓGICA DE ENVÍO Y VALIDACIÓN DEL FORMULARIO
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        feedbackMessage.textContent = '';

        const amount = parseInt(amountInput.value);
        const method = methodSelect.value;
        
        // --- VALIDACIONES ---
        if (isNaN(amount) || amount < minimumAmount) {
            showFeedback(`El monto mínimo de retiro es de $${minimumAmount.toLocaleString()}.`, true);
            amountInput.focus();
            return;
        }
        if (amount % stepAmount !== 0) {
            showFeedback(`El monto debe ser múltiplo de $${stepAmount.toLocaleString()}.`, true);
            amountInput.focus();
            return;
        }
        if (method === "") {
            showFeedback('Por favor, seleccione un método de retiro.', true);
            methodSelect.focus();
            return;
        }
        if (amount > availableBalance) {
            showFeedback('Saldo insuficiente.', true);
            return;
        }

        // 2. PROCESO DE RETIRO EXITOSO (Simulación)
        submitButton.textContent = 'Procesando...';
        submitButton.disabled = true;

        setTimeout(() => {
            showConfirmation(amount, method);
            
            form.reset();
            submitButton.disabled = false;

        }, 2500); 
    });
});