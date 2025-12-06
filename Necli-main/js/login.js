// --- CREDENCIALES SIMULADAS ---
const VALID_PHONE = "3147398347";
const VALID_PIN = "1234";
const HOME_URL = "/Necli-main/pages/home.html"; 
const INDEX_URL = "/Necli-main/index.html"; 

// --- SELECTORES ---
const loginForm = document.getElementById('loginForm');
const btnLogin = document.getElementById('btnLogin');
const btnBack = document.getElementById('btnBack');
const inputPhone = document.getElementById('loginPhoneNumber');
const inputPin = document.getElementById('loginPin');
const errorDisplay = document.getElementById('errorMessage');

// --- MENSAJERÍA ---

/**
 * Muestra un mensaje en el área de errores de la aplicación.
 * @param {string} message - El mensaje a mostrar.
 */
function showMessage(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.opacity = 1;
    
    setTimeout(() => {
        errorDisplay.style.opacity = 0;
        errorDisplay.textContent = '';
    }, 2000); // Ocultar después de 4 segundos
}

// --- LÓGICA DE VALIDACIÓN Y LOGIN ---

function handleLogin(e) {
    e.preventDefault();
    
    const phoneNumber = inputPhone.value.trim();
    const pin = inputPin.value.trim();

    // 1. **VERIFICACIÓN DE CAMPOS VACÍOS**
    if (!inputPhone.checkValidity() || !inputPin.checkValidity()) {
        showMessage("Por favor, complete todos los campos para ingresar. Los formatos deben ser correctos.");
        return;
    }

    // 2. **VERIFICACIÓN DE CREDENCIALES (Funcionalidad Completa)**
    if (phoneNumber !== VALID_PHONE) {
        showMessage("Usuario incorrecto. Verifique su número de teléfono.");
        return;
    }

    // Verificación de Contraseña/PIN
    if (pin !== VALID_PIN) {
        showMessage("Contraseña (PIN) incorrecta. Vuelva a intentarlo.");
        return;
    }

    // 3. Login Exitoso
    showMessage("¡Bienvenido! Iniciando sesión...");
    
    // Redirección al Home
    setTimeout(() => {
        window.location.href = HOME_URL;
    }, 1000); // Se ocualta desues de 2 segundos
}

btnLogin.addEventListener('click', handleLogin);

loginForm.addEventListener('submit', handleLogin); 

btnBack.addEventListener('click', function() {
    window.location.href = INDEX_URL;
});