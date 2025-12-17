document.addEventListener("DOMContentLoaded", async () => {
  // ======================
  // Botones de navegación (Inicio y More)
  // ======================
  const btnHome = document.querySelector("#Inicio");
  const btnMore = document.querySelector("#More");

  btnHome.addEventListener("click", () => {
    window.location.href = "/Necli-main/pages/home.html";
  });

  btnMore.addEventListener("click", () => {
    window.location.href = "/Necli-main/pages/more.html";
  });

  // ======================
  // Obtener usuario y cuenta desde localStorage
  // ======================
  const user = JSON.parse(localStorage.getItem("user"));
  const account = JSON.parse(localStorage.getItem("account"));

  if (!user || !account) {
    console.warn("Usuario o cuenta no encontrados en localStorage");
    window.location.href = "/Necli-main/index.html";
    return;
  }

  if (!account.Account_Number) {
    console.error("Account_Number no definido en localStorage");
    return;
  }

  const container = document.querySelector(".transaction-list");
  container.innerHTML = "";

  // ======================
  // Variables para scroll infinito
  // ======================
  let page = 0;
  const limit = 10; // movimientos por carga
  let loading = false;

  // ======================
  // Función para renderizar cada transacción
  // ======================
  function renderTransaction(tx) {
    let uiType = "expense";
    let arrow = "↓";
    let label = "para";
    let name = "Movimiento";

    if (tx.type === "income") {
      uiType = "income";
      arrow = "↑";
      label = "de";
      name = "Ingreso";
    } else if (tx.type === "expense") {
      arrow = "↓";
      label = "para";
      name = tx.description || "Movimiento";
      // Diferenciar retiro y transferencia
      if (tx.description?.toLowerCase().includes("retiro")) name = "Retiro";
      if (tx.description?.toLowerCase().includes("transferencia")) {
        name = `Cuenta ${tx.Target_Account || ""}`;
      }
    }

    const div = document.createElement("div");
    div.className = `transaction-item ${uiType}`;
    div.innerHTML = `
      <div class="icon-arrow">
        <span>${arrow}</span>
      </div>
      <div class="details">
        <span class="name">${name}</span>
        <span class="type">${label}</span>
      </div>
      <div class="amount">
        $${tx.amount.toLocaleString("es-CO")}
      </div>
    `;

    container.appendChild(div);

    // Animación fade
    setTimeout(() => div.classList.add("show"), 50);
  }

  // ======================
  // Función para cargar transacciones desde backend
  // ======================
  async function loadTransactions() {
    if (loading) return;
    loading = true;

    try {
      const url = `http://localhost:5000/api/transactions/${
        account.Account_Number
      }/history?limit=${limit}&skip=${page * limit}`;
      console.log("Fetching:", url);

      const res = await fetch(url);
      console.log("Status:", res.status);

      let transactions = [];
      try {
        transactions = await res.json();
      } catch (jsonErr) {
        console.error("Respuesta no es JSON válido:", await res.text());
        loading = false;
        return;
      }

      if (!Array.isArray(transactions) || transactions.length === 0) {
        console.log("No hay más transacciones");
        loading = false;
        return;
      }

      transactions.forEach((tx) => renderTransaction(tx));
      page++;
      loading = false;
    } catch (err) {
      console.error("Error cargando transacciones:", err);
      loading = false;
    }
  }

  // ======================
  // Scroll infinito
  // ======================
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 50
    ) {
      loadTransactions();
    }
  });

  // ======================
  // Carga inicial
  // ======================
  loadTransactions();
});
