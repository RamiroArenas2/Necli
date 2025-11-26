// 1. SELECTORES
const form = document.getElementById('registerForm');
const createNecliButton = document.getElementById('btnCreateNecli');
const backButton = document.getElementById('btnBack'); 
const formInputs = form.querySelectorAll('input[required]');
const loginUrl = "/Necli-main/pages/login.html";
const indexUrl = "/Necli-main/index.html"; 

// --- FUNCIONES DE VALIDACIÓN ---

function checkFormValidity() {
    let isFormValid = true;
    formInputs.forEach(input => {
        if (!input.value || !input.checkValidity()) {
            isFormValid = false;
        }
    });

    if (isFormValid) {
        createNecliButton.classList.remove('disabled');
    } else {
        createNecliButton.classList.add('disabled');
    }
}

// --- MANEJO DE EVENTOS ---

// 1. Validación en tiempo real
formInputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
});

// 2. Manejo del click en "Crea tu Necli" (Redirección a Login)
createNecliButton.addEventListener('click', function() {
    
    if (createNecliButton.classList.contains('disabled')) {
        
        alert('Por favor, complete toda la información requerida antes de crear su cuenta.');
        
    } else {
        window.location.href = loginUrl;
    }
});

// 3. Manejo del click en el botón "Volver" (Redirección al Index)
backButton.addEventListener('click', function() {
    window.location.href = indexUrl;
});


// 4. Ejecutar la verificación al cargar la página
window.onload = checkFormValidity;