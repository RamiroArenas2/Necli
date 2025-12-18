document.addEventListener("DOMContentLoaded", async function () {
  // --- 1. ELEMENTOS DEL DOM ---
  const cardScene = document.querySelector(".card-scene");
  const cardFlip = document.getElementById("cardFlip");
  const homeButton = document.getElementById("homeButton");

  // Elementos donde vamos a pintar la info de la DB
  const cardNumDisplay = document.getElementById("cardNumDisplay");
  const cardNameDisplay = document.getElementById("cardNameDisplay");
  const cardExpiryDisplay = document.getElementById("cardExpiryDisplay");
  const cardCVVDisplay = document.getElementById("cardCVVDisplay");

  // Ocultamos el formulario y alertas viejas si existen en el HTML, ya no se usan
  const paymentForm = document.getElementById("paymentForm");
  const tempAlert = document.getElementById("tempAlert");
  const successView = document.getElementById("successView");

  if (paymentForm) paymentForm.style.display = "none";
  if (tempAlert) tempAlert.style.display = "none";
  if (successView) successView.style.display = "block"; // Mostramos siempre el botón de volver

  // --- 2. VALIDACIÓN DE SESIÓN ---
  const user = JSON.parse(localStorage.getItem("user"));
  const account = JSON.parse(localStorage.getItem("account"));

  if (!user || !account) {
    alert("Debes iniciar sesión para ver tu tarjeta");
    window.location.href = "../index.html";
    return;
  }

  // Pintamos el nombre del usuario de una vez (viene del Login)
  if (cardNameDisplay) cardNameDisplay.innerText = user.fullname.toUpperCase();

  // --- 3. FORMATO VISUAL ---
  // Convierte "1234567812345678" en "1234 5678 1234 5678"
  function formatCardNumberDisplay(number) {
    if (!number) return "#### #### #### ####";
    return number.match(/.{1,4}/g).join(" ");
  }

  // --- 4. CARGAR O CREAR TARJETA ---
  async function initCardSystem() {
    try {
      // A. Buscamos si ya tiene tarjeta usando el ID de la CUENTA
      const res = await fetch(
        `http://localhost:5000/api/cards/byAccount/${account._id}`
      );
      const cards = await res.json();

      if (res.ok && cards.length > 0) {
        // SI TIENE TARJETA: La mostramos
        console.log("Tarjeta encontrada:", cards[0]);
        renderCard(cards[0]);
      } else {
        // NO TIENE TARJETA: La creamos automáticamente
        console.log("No tienes tarjeta. Creando una nueva...");
        createCard();
      }
    } catch (error) {
      console.error("Error conectando con el servidor:", error);
      if (cardNumDisplay) cardNumDisplay.innerText = "ERROR CONEXIÓN";
    }
  }

  // --- 5. CREAR TARJETA (POST) ---
  async function createCard() {
    try {
      const res = await fetch("http://localhost:5000/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Id_Account: account._id, // Tu backend exige este campo
        }),
      });

      const newCard = await res.json();

      if (res.ok) {
        renderCard(newCard);
      } else {
        alert("Error generando tarjeta: " + (newCard.error || "Desconocido"));
      }
    } catch (error) {
      console.error("Error en creación:", error);
    }
  }

  // --- 6. PINTAR DATOS EN PANTALLA ---
  function renderCard(cardData) {
    // Usamos TUS nombres de variables del Backend (Card_Number, Card_CCV, etc.)
    if (cardNumDisplay)
      cardNumDisplay.innerText = formatCardNumberDisplay(cardData.Card_Number);
    if (cardExpiryDisplay)
      cardExpiryDisplay.innerText = cardData.Card_Expiration_Date;
    if (cardCVVDisplay) cardCVVDisplay.innerText = cardData.Card_CCV;

    // El nombre siempre es el del usuario logueado
    if (cardNameDisplay)
      cardNameDisplay.innerText = user.fullname.toUpperCase();
  }

  // ==========================================
  // 8. FUNCIONALIDAD BOTÓN COPIAR (Con Boxicons)
  // ==========================================
  const btnCopy = document.getElementById("btnCopy");

  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      // Obtenemos el número sin espacios
      const rawNumber = cardNumDisplay.innerText.replace(/\s/g, "");

      // Copiar al portapapeles
      navigator.clipboard.writeText(rawNumber).then(() => {
        const originalHTML = btnCopy.innerHTML; // Guardamos el estado original

        // Cambiamos a un CHECK verde
        btnCopy.innerHTML = `<i class='bx bx-check-circle icon' style="color: #28a745;"></i><span style="color: #28a745;">¡Listo!</span>`;
        btnCopy.style.background = "#e3f9e5"; // Fondo verde claro

        // Volver a la normalidad en 2 segundos
        setTimeout(() => {
          btnCopy.innerHTML = originalHTML; // Restauramos el icono de copiar
          btnCopy.style.background = "white";
        }, 2000);
      });
    });
  }

  // ==========================================
  // 9. FUNCIONALIDAD BOTÓN CONGELAR (Candado)
  // ==========================================
  const btnFreeze = document.getElementById("btnFreeze");
  let isFrozen = false;

  if (btnFreeze) {
    btnFreeze.addEventListener("click", () => {
      isFrozen = !isFrozen;
      const badge = document.querySelector(".status-badge");
      const card = document.querySelector(".flip-card");

      if (isFrozen) {
        // --- ESTADO: CONGELADO (Candado Cerrado Rojo) ---
        // Usamos 'bx-lock-alt' (Candado cerrado sólido)
        btnFreeze.innerHTML = `<i class='bx bxs-lock-alt icon' style="color: #dc3545;"></i><span style="color: #dc3545;">Desbloq.</span>`;
        btnFreeze.style.background = "#ffebee";

        badge.style.background = "#ffebee";
        badge.style.color = "#dc3545";
        badge.innerHTML = `<span class="dot" style="background:#dc3545; box-shadow:none;"></span> Congelada`;

        if (card) card.style.filter = "grayscale(100%) opacity(0.8)";
      } else {
        // --- ESTADO: ACTIVO (Candado Abierto Morado) ---
        // Usamos 'bx-lock-open-alt' (Candado abierto)
        btnFreeze.innerHTML = `<i class='bx bx-lock-open-alt icon'></i><span>Congelar</span>`;
        btnFreeze.style.background = "white";

        badge.style.background = "#e3f9e5";
        badge.style.color = "#28a745";
        badge.innerHTML = `<span class="dot"></span> Activa`;

        if (card) card.style.filter = "none";
      }
    });
  }

  // ==========================================
  // 10. LÓGICA DEL MODAL DE AJUSTES
  // ==========================================
  const btnSettings = document.getElementById("btnSettings");
  const settingsModal = document.getElementById("settingsModal");
  const btnCloseSettings = document.getElementById("btnCloseSettings");

  // Abrir Modal
  if (btnSettings) {
    btnSettings.addEventListener("click", () => {
      settingsModal.classList.add("active");
    });
  }

  // Cerrar Modal (Botón "Cerrar")
  if (btnCloseSettings) {
    btnCloseSettings.addEventListener("click", () => {
      settingsModal.classList.remove("active");
    });
  }

  // Cerrar Modal (Click afuera en lo oscuro)
  if (settingsModal) {
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove("active");
      }
    });
  }

  // --- 7. EVENTOS ---

  // Girar tarjeta al hacer clic
  if (cardScene) {
    cardScene.addEventListener("click", function () {
      cardFlip.classList.toggle("rotated");
    });
  }

  // Volver al Home
  if (homeButton) {
    homeButton.addEventListener("click", function () {
      window.location.href = "/Necli-main/pages/home.html";
    });
  }

  // INICIAR TODO EL PROCESO
  initCardSystem();
});
