
const LOGIN_API = "http://localhost:5000/api/users/login";

const HOME_URL = "/Necli-main/pages/home.html"; 
const INDEX_URL = "/Necli-main/index.html"; 

const loginForm = document.getElementById('loginForm');
const btnLogin = document.getElementById('btnLogin');
const btnBack = document.getElementById('btnBack');
const inputPhone = document.getElementById('loginPhoneNumber');
const inputPin = document.getElementById('loginPin');
const errorDisplay = document.getElementById('errorMessage');

function showMessage(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.opacity = 1;
    
    setTimeout(() => {
        errorDisplay.style.opacity = 0;
        errorDisplay.textContent = '';
    }, 2000); // Ocultar después de 4 segundos
}

async function handleLogin(e) {
    e.preventDefault();
    
    const phoneNumber = inputPhone.value.trim();
    const pin = inputPin.value.trim();

    if (!inputPhone.checkValidity() || !inputPin.checkValidity()) {
        showMessage("Por favor, complete todos los campos para ingresar. Los formatos deben ser correctos.");
        return;
    }

    try {
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

        if (!res.ok) {
            showMessage(data.error || "Credenciales incorrectas");
            return;
        }

        showMessage("¡Bienvenido! Iniciando sesión...");

        localStorage.setItem("userId", data._id);

        setTimeout(() => {
            window.location.href = HOME_URL;
        }, 500);

    } catch (error) {
        console.error("Error en login:", error);
        showMessage("Error de conexión con el servidor.");
    }
}

btnLogin.addEventListener('click', handleLogin);
loginForm.addEventListener('submit', handleLogin);
btnBack.addEventListener('click', () => {
    window.location.href = INDEX_URL;
});
