document.addEventListener('DOMContentLoaded', function() {
    const formCredito = document.getElementById('formCredito');
    const submitButton = formCredito.querySelector('button[type="submit"]');
    const requiredFields = formCredito.querySelectorAll('[required]');
    
    const successMessage = document.getElementById('successMessage'); 

    submitButton.disabled = true;

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

    requiredFields.forEach(field => {
        field.addEventListener('input', checkFormValidity);
        field.addEventListener('change', checkFormValidity);
    });

    formCredito.addEventListener('submit', function(event) {
        event.preventDefault();

        if (submitButton.disabled) {
            alert("Por favor, complete todos los campos requeridos antes de enviar la solicitud.");
            return;
        }

        formCredito.style.display = 'none';
        
        successMessage.classList.add('show');


        formCredito.reset();
        
        submitButton.disabled = true;

        setTimeout(() => {
            window.location.href = '/Necli-main/pages/home.html'; 
        }, 2500); 
    });

    checkFormValidity();
});