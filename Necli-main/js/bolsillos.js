document.addEventListener("DOMContentLoaded", async () => {
  // --- REFERENCIAS A MODALES Y ELEMENTOS ---
  const modalCrear = document.getElementById("modal-overlay");
  const modalOptions = document.getElementById("modal-options");
  const modalTransaction = document.getElementById("modal-transaction");
  const container = document.getElementById("bolsillos-container");
  const totalDisplay = document.getElementById("total-bolsillos");

  // --- VARIABLES DE ESTADO ---
  let bolsilloActualId = null; // Guardamos el _id de Mongo
  let bolsilloActualElemento = null; // Guardamos la tarjeta visual
  let tipoTransaccion = ""; // "deposit" o "withdraw"

  // ==========================================
  // 1. SEGURIDAD: VERIFICAR LOGIN
  // ==========================================
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("No has iniciado sesión. Redirigiendo...");
    window.location.href = "../index.html";
    return;
  }

  // ==========================================
  // 2. CARGAR BOLSILLOS AL INICIAR
  // ==========================================
  async function cargarBolsillos() {
    try {
      const res = await fetch(`http://localhost:5000/api/pockets/${userId}`);

      if (!res.ok) throw new Error("Error al conectar con el servidor");

      const bolsillos = await res.json();

      container.innerHTML = "";

      if (bolsillos.length === 0) {
        container.innerHTML = `
                    <div class="empty-state">
                        <img src="/Necli-main/img/información.jpg" alt="No hay bolsillos">
                        <p>Aún no tienes bolsillos creados.</p>
                    </div>`;
        if (totalDisplay) totalDisplay.innerText = "$ 0";
      } else {
        bolsillos.forEach((pocket) => {
          renderPocket(
            pocket._id,
            pocket.name,
            pocket.targetAmount,
            pocket.currentAmount
          );
        });
        actualizarTotalGeneral();
      }
    } catch (error) {
      console.error("Error cargando bolsillos:", error);
      container.innerHTML = `<p style="text-align:center; color:red;">Error de conexión.</p>`;
    }
  }

  await cargarBolsillos();

  // ==========================================
  // 3. MODALES Y NAVEGACIÓN
  // ==========================================
  window.onclick = (e) => {
    if (e.target === modalCrear) modalCrear.classList.remove("active");
    if (e.target === modalOptions) modalOptions.classList.remove("active");
    if (e.target === modalTransaction)
      modalTransaction.classList.remove("active");
  };

  const btnOpenCrear = document.getElementById("open-modal");
  const btnCloseCrear = document.getElementById("close-modal");

  if (btnOpenCrear)
    btnOpenCrear.onclick = () => modalCrear.classList.add("active");
  if (btnCloseCrear)
    btnCloseCrear.onclick = () => modalCrear.classList.remove("active");

  const btnCloseOptions = document.getElementById("close-options");
  if (btnCloseOptions)
    btnCloseOptions.onclick = () => modalOptions.classList.remove("active");

  const btnCloseTrans = document.getElementById("close-transaction");
  if (btnCloseTrans)
    btnCloseTrans.onclick = () => modalTransaction.classList.remove("active");

  // ==========================================
  // 4. CREAR BOLSILLO
  // ==========================================
  const formCrear = document.getElementById("form-crear-bolsillo");
  if (formCrear) {
    formCrear.onsubmit = async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombre-bolsillo").value;
      const meta = document.getElementById("meta-ahorro").value;

      try {
        const res = await fetch("http://localhost:5000/api/pockets/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, name: nombre, targetAmount: meta }),
        });

        const data = await res.json();

        if (res.ok) {
          renderPocket(
            data._id,
            data.name,
            data.targetAmount,
            data.currentAmount
          );

          const empty = document.querySelector(".empty-state");
          if (empty) empty.style.display = "none";

          modalCrear.classList.remove("active");
          e.target.reset();
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor");
      }
    };
  }

  // ==========================================
  // 5. RENDERIZAR TARJETA
  // ==========================================
  function renderPocket(id, nombre, meta, actual) {
    const card = document.createElement("div");
    card.className = "pocket-card";
    card.id = `pocket-${id}`; // Le ponemos ID al div para poder borrarlo fácil después

    card.dataset.id = id;
    card.dataset.current = actual;
    card.dataset.meta = meta;

    let porcentaje = (actual / meta) * 100;
    if (porcentaje > 100) porcentaje = 100;
    let colorBarra =
      actual >= meta ? "#28a745" : "linear-gradient(90deg, #916cdb, #2f2680)";

    card.innerHTML = `
            <div class="pocket-header">
                <div class="pocket-info">
                    <span class="pocket-icon">💰</span>
                    <span class="pocket-name">${nombre}</span>
                </div>
                <button class="btn-more">···</button>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${porcentaje}%; background: ${colorBarra}"></div>
            </div>
            <div class="pocket-values">
                <span><b class="current-val">$ ${parseInt(
                  actual
                ).toLocaleString("es-CO")}</b> ahorrados</span>
                <span>Meta: $ ${parseInt(meta).toLocaleString("es-CO")}</span>
            </div>
        `;

    card.querySelector(".btn-more").onclick = () => {
      bolsilloActualId = id;
      bolsilloActualElemento = card;
      document.getElementById("options-title").innerText = nombre;
      modalOptions.classList.add("active");
    };

    const empty = document.querySelector(".empty-state");
    if (empty) empty.style.display = "none";

    container.appendChild(card);
  }

  // ==========================================
  // 6. TRANSACCIONES (METER/SACAR)
  // ==========================================
  const btnAdd = document.getElementById("btn-open-add");
  if (btnAdd) {
    btnAdd.onclick = () => {
      tipoTransaccion = "deposit";
      document.getElementById("transaction-title").innerText = "Meter Plata";
      document.getElementById("transaction-desc").innerText =
        "Se descontará de tu Disponible";
      document.getElementById("transaction-amount").value = "";
      modalOptions.classList.remove("active");
      modalTransaction.classList.add("active");
    };
  }

  const btnWithdraw = document.getElementById("btn-open-withdraw");
  if (btnWithdraw) {
    btnWithdraw.onclick = () => {
      tipoTransaccion = "withdraw";
      document.getElementById("transaction-title").innerText = "Sacar Plata";
      document.getElementById("transaction-desc").innerText =
        "Volverá a tu Disponible";
      document.getElementById("transaction-amount").value = "";
      modalOptions.classList.remove("active");
      modalTransaction.classList.add("active");
    };
  }

  const formTrans = document.getElementById("form-transaction");
  if (formTrans) {
    formTrans.onsubmit = async (e) => {
      e.preventDefault();
      const montoInput = document.getElementById("transaction-amount").value;
      const monto = parseInt(montoInput);

      if (monto <= 0) return alert("Ingresa un valor válido");

      try {
        const res = await fetch(
          "http://localhost:5000/api/pockets/transaction",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              pocketId: bolsilloActualId,
              amount: monto,
              type: tipoTransaccion,
            }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          // Actualizar UI con la respuesta del server
          const nuevoSaldo = data.newPocketBalance;
          const meta = parseInt(bolsilloActualElemento.dataset.meta);

          bolsilloActualElemento.dataset.current = nuevoSaldo;
          bolsilloActualElemento.querySelector(
            ".current-val"
          ).innerText = `$ ${nuevoSaldo.toLocaleString("es-CO")}`;

          let porcentaje = (nuevoSaldo / meta) * 100;
          if (porcentaje > 100) porcentaje = 100;

          const barra = bolsilloActualElemento.querySelector(".progress-bar");
          barra.style.width = `${porcentaje}%`;

          if (nuevoSaldo >= meta) {
            barra.style.background = "#28a745";
          } else {
            barra.style.background = "linear-gradient(90deg, #916cdb, #2f2680)";
          }

          actualizarTotalGeneral();
          modalTransaction.classList.remove("active");

          // Mensaje de éxito
          alert(
            tipoTransaccion === "deposit"
              ? "¡Ahorro exitoso!"
              : "¡Dinero devuelto a tu cuenta!"
          );
        } else {
          // Aquí sale "Fondos insuficientes" si no tienes saldo en la cuenta principal
          alert("Error: " + data.error);
        }
      } catch (error) {
        console.error(error);
        alert("Error de conexión");
      }
    };
  }

  // ==========================================
  // 7. ELIMINAR BOLSILLO (NUEVO)
  // ==========================================
  const btnDelete = document.getElementById("btn-delete-pocket");
  if (btnDelete) {
    btnDelete.onclick = async () => {
      // Confirmación básica
      const confirmar = confirm(
        "¿Estás seguro de eliminar este bolsillo? El dinero volverá a tu cuenta."
      );

      if (!confirmar) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/pockets/${bolsilloActualId}`,
          {
            method: "DELETE",
          }
        );

        const data = await res.json();

        if (res.ok) {
          // Borrar tarjeta de la pantalla
          if (bolsilloActualElemento) {
            bolsilloActualElemento.remove();
          }

          actualizarTotalGeneral();
          modalOptions.classList.remove("active");
          alert("Bolsillo eliminado. " + data.message);

          // Si no quedan bolsillos, mostrar el empty state
          const cards = document.querySelectorAll(".pocket-card");
          if (cards.length === 0) {
            container.innerHTML = `
                            <div class="empty-state">
                                <img src="/Necli-main/img/información.jpg" alt="No hay bolsillos">
                                <p>Aún no tienes bolsillos creados.</p>
                            </div>`;
          }
        } else {
          alert("No se pudo eliminar: " + data.error);
        }
      } catch (error) {
        console.error(error);
        alert("Error al intentar eliminar.");
      }
    };
  }

  // ==========================================
  // 8. UTILIDADES
  // ==========================================
  function actualizarTotalGeneral() {
    const cards = document.querySelectorAll(".pocket-card");
    let total = 0;
    cards.forEach((card) => {
      total += parseInt(card.dataset.current);
    });
    if (totalDisplay) {
      totalDisplay.innerText = `$ ${total.toLocaleString("es-CO")}`;
    }
  }
});
