document.addEventListener("DOMContentLoaded", () => {
  const btnHomeTransfers = document.querySelector("#regresar");

  btnHomeTransfers.addEventListener("click", () => {
    window.location.href = "/Necli-main/pages/home.html";
  });
});