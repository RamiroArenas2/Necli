document.addEventListener("DOMContentLoaded", () => {
  const btnHomeTransfers = document.querySelector("#regresar");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/Necli-main/pages/login.html";
    return;
  }

  const accountNumber = user.phone; // cuenta origen
  console.log("Cuenta origen:", accountNumber);

  // Selectores de inputs y botón
  const toInput = document.getElementById("toAccount");
  const amountInput = document.getElementById("amount");
  const descInput = document.getElementById("description");
  const btnTransfer = document.getElementById("btnTransfer");

  // Mensaje de feedback
  function showFeedback(msg) {
    alert(msg); // simple alert por ahora
  }

  // Función para actualizar saldo en localStorage y Home
  async function updateLocalBalance() {
    try {
      const resOrigin = await fetch(
        `http://localhost:5000/api/accounts/${accountNumber}`
      );
      const updatedData = await resOrigin.json();
      if (resOrigin.ok) {
        const userStorage = JSON.parse(localStorage.getItem("user"));
        userStorage.Balance_Account = updatedData.Balance_Account;
        localStorage.setItem("user", JSON.stringify(userStorage));
      }
    } catch (error) {
      console.error("Error actualizando saldo local:", error);
    }
  }

  // Click en "Continuar" para hacer transferencia
  btnTransfer.addEventListener("click", async (e) => {
    e.preventDefault();

    const to = toInput.value.trim();
    const amount = parseInt(amountInput.value);
    const description = descInput.value.trim();

    if (!to || isNaN(amount) || amount <= 0) {
      showFeedback("Complete todos los campos correctamente");
      return;
    }

    try {
      // 1️⃣ Verificar cuenta destino
      const resDest = await fetch(`http://localhost:5000/api/accounts/${to}`);
      const destData = await resDest.json();
      if (!resDest.ok) {
        showFeedback(destData.error || "Cuenta destino no existe");
        return;
      }

      // 2️⃣ Obtener cuenta origen y saldo
      const resOrigin = await fetch(
        `http://localhost:5000/api/accounts/${accountNumber}`
      );
      const originData = await resOrigin.json();
      if (!resOrigin.ok) {
        showFeedback(originData.error || "Cuenta origen no encontrada");
        return;
      }

      // 3️⃣ Validar saldo
      if (amount > originData.Balance_Account) {
        showFeedback("Saldo insuficiente para realizar la transferencia");
        return;
      }

      // 4️⃣ Realizar la transferencia en backend
      const resTransfer = await fetch(
        "http://localhost:5000/api/transactions/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            From: accountNumber,
            To: to,
            Amount: amount,
          }),
        }
      );

      const transferData = await resTransfer.json();
      if (!resTransfer.ok) {
        showFeedback(
          transferData.error || "Error al realizar la transferencia"
        );
        return;
      }

      // 5️⃣ Actualizar saldo local
      await updateLocalBalance();

      // Confirmación
      showFeedback(
        `Transferencia de $${amount.toLocaleString()} realizada con éxito`
      );

      // Limpiar inputs
      toInput.value = "";
      amountInput.value = "";
      descInput.value = "";
    } catch (error) {
      console.error("Error durante la transferencia:", error);
      showFeedback("Error de conexión con el servidor");
    }
  });

  // Botón regresar a Home
  btnHomeTransfers.addEventListener("click", () => {
    window.location.href = "/Necli-main/pages/home.html";
  });
});
