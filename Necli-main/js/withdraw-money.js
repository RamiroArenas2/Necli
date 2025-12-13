document.addEventListener("DOMContentLoaded", () => {
  let availableBalance = 0;
  let accountNumber = "";

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/Necli-main/pages/login.html";
    return;
  }

  async function loadAccountData() {
    try {
      accountNumber = user.phone;

      const res = await fetch(
        `http://localhost:5000/api/accounts/${accountNumber}`
      );

      const data = await res.json();

      if (!res.ok) {
        showFeedback("No se pudo cargar el saldo", true);
        return;
      }

      availableBalance = data.Balance_Account;

      console.log("Saldo cargado:", availableBalance);
    } catch (error) {
      console.error("Error cargando saldo:", error);
      showFeedback("Error de conexión", true);
    }
  }

  loadAccountData();

  const form = document.getElementById("withdrawForm");
  const amountInput = document.getElementById("amount");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const submitButton = form.querySelector('button[type="submit"]');

  const withdrawContainer = document.getElementById("withdrawContainer");
  const confirmationScreen = document.getElementById("confirmationScreen");
  const confirmationMessage = document.getElementById("confirmationMessage");
  const homeButton = document.getElementById("homeButton");

  // ✅ FIX CLAVE
  withdrawContainer.style.display = "flex";
  confirmationScreen.style.display = "none";
  feedbackMessage.textContent = "";

  // ----- Custom select -----
  const customSelect = document.getElementById("methodSelect");
  const selected = customSelect.querySelector(".select-selected");
  const items = customSelect.querySelector(".select-items");
  let selectedMethod = "";

  selected.addEventListener("click", () => {
    items.classList.toggle("select-hide");
  });

  items.querySelectorAll("div").forEach((option) => {
    option.addEventListener("click", () => {
      selected.textContent = option.textContent;
      selectedMethod = option.dataset.value;
      items.classList.add("select-hide");
    });
  });

  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      items.classList.add("select-hide");
    }
  });

  // ----- Datos base -----
  const minimumAmount = 10000;
  const stepAmount = 5000;

  const methodMap = {
    necli_atm: "Corresponsal Necli (Red Aliada)",
    bancolombia: "Corresponsal Bancolombia (A la Mano)",
  };

  function showFeedback(message, isError = false) {
    feedbackMessage.textContent = message;
    feedbackMessage.style.color = isError ? "#ff4d4d" : "#00e676";
  }

  function showConfirmation(amount, method) {
    confirmationMessage.innerHTML = `
      Retiro por <b>$${amount.toLocaleString()}</b><br><br>
      Podrás retirarlo en:<br><b>${methodMap[method]}</b>
    `;

    withdrawContainer.style.display = "none";
    confirmationScreen.style.display = "flex";
  }

  homeButton.addEventListener("click", () => {
    window.location.href = "/Necli-main/pages/home.html";
  });

  // ----- Submit -----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = parseInt(amountInput.value);

    if (isNaN(amount) || amount < minimumAmount) {
      showFeedback(`Monto mínimo $${minimumAmount.toLocaleString()}`, true);
      return;
    }

    if (amount % stepAmount !== 0) {
      showFeedback(
        `Debe ser múltiplo de $${stepAmount.toLocaleString()}`,
        true
      );
      return;
    }

    if (!selectedMethod) {
      showFeedback("Seleccione un método de retiro", true);
      return;
    }

    if (amount > availableBalance) {
      showFeedback("Saldo insuficiente", true);
      return;
    }

    submitButton.textContent = "Procesando...";
    submitButton.disabled = true;

    try {
      const res = await fetch(
        "http://localhost:5000/api/transactions/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Account_Number: accountNumber,
            Amount: amount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showFeedback(data.error || "Error al retirar", true);
        submitButton.textContent = "Retirar";
        submitButton.disabled = false;
        return;
      }

      // 🔥 Actualizar saldo local
      availableBalance -= amount;

      showConfirmation(amount, selectedMethod);

      form.reset();
      selected.textContent = "Seleccione una opción";
      selectedMethod = "";
      submitButton.textContent = "Retirar";
      submitButton.disabled = false;
    } catch (error) {
      console.error("Error en retiro:", error);
      showFeedback("Error de conexión", true);
      submitButton.textContent = "Retirar";
      submitButton.disabled = false;
    }
  });
});
