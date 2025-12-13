// --- ENDPOINT REAL ---
const LOGIN_API = "http://localhost:5000/api/users/login";

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
function showMessage(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.opacity = 1;
    
    setTimeout(() => {
        errorDisplay.style.opacity = 0;
        errorDisplay.textContent = '';
    }, 2000); // Ocultar después de 4 segundos
}

// --- LÓGICA LOGIN CON BACKEND ---
async function handleLogin(e) {
    e.preventDefault();
    
    const phoneNumber = inputPhone.value.trim();
    const pin = inputPin.value.trim();

    // 1. Validaciones HTML (phone + PIN)
    if (!inputPhone.checkValidity() || !inputPin.checkValidity()) {
        showMessage("Por favor, complete todos los campos para ingresar. Los formatos deben ser correctos.");
        return;
    }

    try {
        // 2. Hacer petición al backend
        const res = await fetch(LOGIN_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phone: phoneNumber,
                password: pin
            })
        });

        const data = await res.json();

        // Si el backend responde error
        if (!res.ok) {
            showMessage(data.error || "Credenciales incorrectas");
            return;
        }

        // 3. Login válido
        showMessage("¡Bienvenido! Iniciando sesión...");

        // Guardar sesión local (por ahora solo ID)
        localStorage.setItem("user", JSON.stringify(data));


        setTimeout(() => {
            window.location.href = HOME_URL;
        }, 500);

    } catch (error) {
        console.error("Error en login:", error);
        showMessage("Error de conexión con el servidor.");
    }
}

// --- EVENT LISTENERS ---
btnLogin.addEventListener('click', handleLogin);
loginForm.addEventListener('submit', handleLogin);
btnBack.addEventListener('click', () => {
    window.location.href = INDEX_URL;
});
