document.addEventListener('DOMContentLoaded', function() {
    // 1. Obtener referencias a los elementos clave del DOM
    const formCredito = document.getElementById('formCredito');
    const submitButton = formCredito.querySelector('button[type="submit"]');
    const requiredFields = formCredito.querySelectorAll('[required]');
    
    // ⭐⭐ AQUÍ VA LA REFERENCIA AL MENSAJE DE ÉXITO (Paso 1 del cambio) ⭐⭐
    const successMessage = document.getElementById('successMessage'); 

    // Inicializar el botón deshabilitado
    submitButton.disabled = true;

    // Función para verificar si todos los campos requeridos están llenos
    function checkFormValidity() {
        let allValid = true;
        
        requiredFields.forEach(field => {
            // El campo es inválido si está vacío (input/textarea) o si la opción seleccionada es la vacía (select)
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

        // Habilitar o deshabilitar el botón de envío
        submitButton.disabled = !allValid;
    }

    // 2. Escuchar cambios en todos los campos requeridos para validación en tiempo real
    requiredFields.forEach(field => {
        field.addEventListener('input', checkFormValidity);
        field.addEventListener('change', checkFormValidity); // Útil para el <select>
    });

    // 3. Manejar el evento de envío del formulario
    formCredito.addEventListener('submit', function(event) {
        // Prevenir el envío por defecto para manejarlo con JS
        event.preventDefault();

        // Validar una última vez
        if (submitButton.disabled) {
            // Mantenemos el alert simple en caso de un intento de envío no válido.
            alert("Por favor, complete todos los campos requeridos antes de enviar la solicitud.");
            return;
        }

        // --- Lógica de Simulación de Envío con Mensaje CSS ---

        // ⭐⭐ CAMBIO CLAVE: OCULTAR EL FORMULARIO (Paso 2 del cambio) ⭐⭐
        // Ocultamos el formulario para que solo se vea el mensaje de éxito.
        formCredito.style.display = 'none';
        
        // ⭐⭐ CAMBIO CLAVE: MOSTRAR EL MENSAJE CSS (Paso 3 del cambio) ⭐⭐
        // Agregamos la clase 'show' que definimos en CSS para hacerlo visible.
        successMessage.classList.add('show');


        // Limpiar el formulario después del envío (opcional)
        formCredito.reset();
        
        // Deshabilitar el botón después de limpiar el formulario
        submitButton.disabled = true;

        // Redirigir al usuario a la página de inicio (ajusta la URL según tu estructura)
        // Damos 2.5 segundos para que el usuario pueda leer el mensaje estilizado.
        setTimeout(() => {
            // Reemplaza '/home.html' con la ruta real de tu página de inicio
            window.location.href = '/Necli-main/home.html'; 
        }, 2500); 
    });

    // Ejecutar la validación inicial al cargar la página (por si hay campos autocompletados)
    checkFormValidity();
});