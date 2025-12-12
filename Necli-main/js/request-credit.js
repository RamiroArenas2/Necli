document.addEventListener('DOMContentLoaded', function() {
    // 1. Obtener referencias a los elementos clave del DOM
    const formCredito = document.getElementById('formCredito');
    const submitButton = formCredito.querySelector('button[type="submit"]');
    const requiredFields = formCredito.querySelectorAll('[required]');
    
    const successMessage = document.getElementById('successMessage'); 

    submitButton.disabled = true;

    // Función para verificar si todos los campos requeridos están llenos
    function checkFormValidity() {
        let allValid = true;
        
        requiredFields.forEach(field => {

            if (field.type === 'select-one') {
                if (field.value === '') {
                    allValid = false;
                }
            } else {
                if (field.value.trim() === '') {
                    allValid = false;
                }
            }
        });

        submitButton.disabled = !allValid;
    }

    // 2. Escuchar cambios en todos los campos requeridos para validación en tiempo real
    requiredFields.forEach(field => {
        field.addEventListener('input', checkFormValidity);
        field.addEventListener('change', checkFormValidity);
    });

    // 3. Manejar el evento de envío del formulario
    formCredito.addEventListener('submit', function(event) {
        event.preventDefault();

        if (submitButton.disabled) {
            alert("Por favor, complete todos los campos requeridos antes de enviar la solicitud.");
            return;
        }

        formCredito.style.display = 'none';
        
        // CAMBIO CLAVE: MOSTRAR EL MENSAJE CSS (Paso 3 del cambio)
        successMessage.classList.add('show');


        // Limpiar el formulario después del envío (opcional)
        formCredito.reset();
        
        // Deshabilitar el botón después de limpiar el formulario
        submitButton.disabled = true;

        // Redirigir al usuario a la página de inicio (ajusta la URL según tu estructura)
        setTimeout(() => {
            window.location.href = '/Necli-main/pages/home.html'; 
        }, 2500); 
    });

    // Ejecutar la validación inicial al cargar la página (por si hay campos autocompletados)
    checkFormValidity();
});