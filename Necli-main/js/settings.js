document.addEventListener('DOMContentLoaded', () => { 

    const btnBack = document.getElementById('btn-back');
    const btnUpdateInfo = document.getElementById('btn-update-info');
    const btnChangePass = document.getElementById('btn-change-pass');
    const btnDeleteAccount = document.getElementById('btn-delete-account');
    const btnHelp = document.getElementById('btn-help');
    const btnLogout = document.getElementById('btn-logout');


    btnBack.addEventListener('click', () => {
        window.location.href = "../pages/home.html"
    });

    btnLogout.addEventListener('click', function() {
        const confirmacion = confirm("¿Estás seguro de que deseas cerrar sesión?");
        if (confirmacion)
            console.log("Sesión cerrada");
        window.location.href = "../index.html"
    });

});