document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirigir si no hay usuario
  if (!user) {
    window.location.href = "/Necli-main/pages/login.html"; // Ajusta ruta si es necesario
    return;
  }

  // Mostrar nombre
  document.getElementById("name-user").textContent = user.fullname;

  // FUNCIÓN PARA ACTUALIZAR EL SALDO
  async function updateBalance() {
    const accountNumber = user.phone; // O Account_Number si lo guardaste diferente
    const balanceElement = document.getElementById("balance");

    try {
      // Llamada al backend para obtener saldo fresco
      const res = await fetch(
        `http://localhost:5000/api/accounts/${accountNumber}`
      );

      if (!res.ok) {
        console.warn("Cuenta no encontrada");
        balanceElement.textContent = formatCurrency(0);
        return;
      }

      const account = await res.json();

      // Guardamos la cuenta actualizada en localStorage por si acaso
      localStorage.setItem("account", JSON.stringify(account));

      // Usamos Balance_Account (nombre exacto del modelo)
      const balance =
        typeof account.Balance_Account === "number"
          ? account.Balance_Account
          : 0;
      balanceElement.textContent = formatCurrency(balance);
    } catch (error) {
      console.error("Error actualizando saldo:", error);
      balanceElement.textContent = formatCurrency(0);
    }
  }

  // Helper para formato de moneda
  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  }

  // 1. Ejecutar al cargar la página
  await updateBalance();

  // 2. Ejecutar cada vez que la página vuelve a tener foco (Regreso de Bolsillos)
  window.addEventListener("focus", updateBalance);
});
