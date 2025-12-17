document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirigir si no hay usuario
  if (!user) {
    window.location.href = "/Necli-main/pages/login.html";
    return;
  }

  //  Mostrar nombre
  document.getElementById("name-user").textContent = user.fullname;

  //  Obtener número de cuenta (phone)
  const accountNumber = user.phone;

  //  Referencia al elemento de saldo
  const balanceElement = document.getElementById("balance");

  try {
    const res = await fetch(
      `http://localhost:5000/api/accounts/${accountNumber}`
    );

    // Si la cuenta no existe
    if (!res.ok) {
      console.warn("Cuenta no encontrada, mostrando saldo 0");
      balanceElement.textContent = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(0);
      return;
    }

    const account = await res.json();

    //  Validar que Balance_Account exista
    const balance =
      typeof account.Balance_Account === "number" ? account.Balance_Account : 0;

    //  Mostrar saldo formateado
    balanceElement.textContent = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(balance);
  } catch (error) {
    console.error("Error obteniendo la cuenta:", error);
    balanceElement.textContent = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(0);
  }
});
