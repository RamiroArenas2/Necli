document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".transaction-list");
    const account = JSON.parse(localStorage.getItem("account"));

    if (!account) {
        window.location.href = "/Necli-main/index.html";
        return;
    }

    // Configuración de navegación (Asegúrese que los IDs existan en el HTML)
    document.getElementById("Inicio").parentElement.onclick = () => window.location.href = "/Necli-main/pages/home.html";
    document.getElementById("More").parentElement.onclick = () => window.location.href = "/Necli-main/pages/more.html";

    let page = 0;
    const limit = 10;
    let loading = false;
    let hasMore = true;

    function renderTransaction(tx) {
        // --- DEPURACIÓN: Mire esto en la consola del navegador (F12) ---
        console.log("Transacción recibida:", tx.description, "Tipo:", tx.type);

        // Forzamos la detección del tipo
        // Si en tu DB el tipo llega como "income", "deposit" o algo que sume:
        const isIncome = tx.type === "income"; 
        
        // Asignamos clases y símbolos basado en isIncome
        const uiClass = isIncome ? "income" : "expense";
        const arrowSymbol = isIncome ? "↑" : "↓";
        const labelText = isIncome ? "de" : "para";
        
        let name = tx.description || "Movimiento";
        if (tx.relatedUser) name = tx.relatedUser;

        const div = document.createElement("div");
        div.className = `transaction-item ${uiClass}`; // Aquí se pone .income o .expense
        div.innerHTML = `
            <div class="icon-arrow"><span>${arrowSymbol}</span></div>
            <div class="details">
                <span class="name">${name}</span>
                <span class="type">${labelText}</span>
            </div>
            <div class="amount">${isIncome ? "+" : "-"} $${tx.amount.toLocaleString("es-CO")}</div>
        `;
        container.appendChild(div);
        
        // Animación de entrada
        setTimeout(() => div.classList.add("show"), 50);
    }

    async function loadTransactions() {
        if (loading || !hasMore) return;
        loading = true;

        try {
            const url = `http://localhost:5000/api/transactions/${account.Account_Number}/history?limit=${limit}&skip=${page * limit}`;
            const res = await fetch(url);
            const transactions = await res.json();

            if (!transactions || transactions.length === 0) {
                hasMore = false;
                if (page === 0) container.innerHTML = "<p style='text-align:center; color:#888; margin-top:50px;'>No hay movimientos aún.</p>";
                return;
            }

            transactions.forEach(renderTransaction);
            page++; 
        } catch (err) {
            console.error("Error cargando historial:", err);
        } finally {
            // Evita disparar el scroll infinito demasiadas veces
            setTimeout(() => { loading = false; }, 1000);
        }
    }

    // Scroll infinito corregido
    window.onscroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            loadTransactions();
        }
    };

    loadTransactions();
});