// 1. SELECTORES
const form = document.getElementById("registerForm");
const createNecliButton = document.getElementById("btnCreateNecli");
const backButton = document.getElementById("btnBack");
const formInputs = form.querySelectorAll("input[required]");
const loginUrl = "/Necli-main/pages/login.html";
const indexUrl = "/Necli-main/index.html";

// --- FUNCIONES DE VALIDACIÓN ---

function checkFormValidity() {
  let isFormValid = true;
  formInputs.forEach((input) => {
    if (!input.value || !input.checkValidity()) {
      isFormValid = false;
    }
  });

  if (isFormValid) {
    createNecliButton.classList.remove("disabled");
  } else {
    createNecliButton.classList.add("disabled");
  }
}

formInputs.forEach((input) => {
  input.addEventListener("input", checkFormValidity);
});

createNecliButton.addEventListener("click", async function () {
  if (createNecliButton.classList.contains("disabled")) {
    alert(
      "Por favor, complete toda la información requerida antes de crear su cuenta."
    );
    return;
  }

  const fullname = document.getElementById("fullname").value;
  const idtype = document.getElementById("idtype").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const birthDate = document.getElementById("age").value;
  const pin = document.getElementById("pin").value;

  const newUser = { fullname, idtype, phone, email, birthDate, pin };

  try {
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Usuario creado correctamente 🎉");
      window.location.href = loginUrl;
    } else {
      alert(data.error || "Error creando usuario");
    }
  } catch (error) {
    console.error("Error comunicándose con el backend:", error);
    alert("Hubo un problema al conectar con el servidor.");
  }
});

backButton.addEventListener("click", function () {
  window.location.href = indexUrl;
});

window.onload = checkFormValidity;
