document.addEventListener("DOMContentLoaded", () => {
  const btnBack = document.getElementById("btn-back");
  const btnUpdateInfo = document.getElementById("btn-update-info");
  const btnChangePass = document.getElementById("btn-change-pass");
  const btnDeleteAccount = document.getElementById("btn-delete-account");
  const btnHelp = document.getElementById("btn-help");
  const btnLogout = document.getElementById("btn-logout");

  btnBack.addEventListener("click", () => {
    window.location.href = "/Necli.main/pages/home.html";
  });

  btnLogout.addEventListener("click", () => {
    const confirmacion = confirm("¿Estás seguro de que deseas cerrar sesión?");

    if (confirmacion) {
      console.log("Sesión cerrada");
      window.location.href = "../index.html";
    } else {
      console.log("Cierre de sesión cancelado");
    }

    const btnUpdateInfo = document.getElementById("btn-update-info");
    const infoSection = document.getElementById("info-section");
    const mainContent = document.querySelector(".profile-content");
    const backInfo = document.getElementById("btn-back-info");

    btnUpdateInfo.addEventListener("click", () => {
      mainContent.style.display = "none"; // Oculta pantalla principal
      infoSection.classList.remove("hidden"); // Muestra la cascada
    });

    backInfo.addEventListener("click", () => {
      infoSection.classList.add("hidden"); // Cierra cascada
      mainContent.style.display = "block"; // Muestra pantalla principal
    });

    btnActInfo.addEventListener("click", () => {});
  });
});
