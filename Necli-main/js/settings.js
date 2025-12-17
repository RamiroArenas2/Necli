document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:5000/api/users";
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/Necli-main/index.html";
    return;
  }

  // ======================
  // SELECTORES
  // ======================
  const $ = (id) => document.getElementById(id);

  const panels = {
    update: $("panel-update"),
    pass: $("panel-change-pass"),
    delete: $("panel-delete"),
    help: $("panel-help"),
  };

  const inputName = $("input-name");
  const inputDocument = $("input-doc");
  const inputPhone = $("input-phone");
  const inputEmail = $("input-email");
  const inputAge = $("input-age");

  const inputOld = $("input-oldpass");
  const inputNew = $("input-newpass");
  const inputConfirm = $("input-confirm");

  const userNameTitle = $("user-name");

  // ======================
  // PANEL CONTROL
  // ======================
  function openPanel(panel) {
    Object.values(panels).forEach((p) => p.setAttribute("aria-hidden", "true"));
    panel.setAttribute("aria-hidden", "false");
  }

  function closePanel(panel) {
    panel.setAttribute("aria-hidden", "true");
  }

  // ======================
  // CARGAR DATOS DEL USUARIO
  // ======================
  function loadUserData() {
    userNameTitle.textContent = user.fullname;

    inputName.value = user.fullname;
    inputDocument.value = user.idtype;
    inputPhone.value = user.phone;
    inputEmail.value = user.email;
    inputAge.value = Number(user.age) || "";
  }

  loadUserData();

  // ======================
  // ACTUALIZAR INFORMACIÓN
  // ======================
  $("btn-update-info").addEventListener("click", () =>
    openPanel(panels.update)
  );

  $("save-update").addEventListener("click", async () => {
    try {
      const updatedUser = {
        fullname: inputName.value,
        idtype: inputDocument.value,
        phone: inputPhone.value,
        email: inputEmail.value,
        age: inputAge.value,
      };

      console.log("DATA A ENVIAR:", {
        fullname: inputName.value,
        idtype: inputDocument.value,
        phone: inputPhone.value,
        email: inputEmail.value,
        age: inputAge.value,
      });

      const res = await fetch(`${API_URL}/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      userNameTitle.textContent = data.fullname;

      alert("Información actualizada correctamente");
      closePanel(panels.update);
    } catch (err) {
      alert("Error actualizando información");
    }
  });

  $("cancel-update").addEventListener("click", () => closePanel(panels.update));
  $("cancel-update-btn").addEventListener("click", () =>
    closePanel(panels.update)
  );

  // ======================
  // CAMBIAR CONTRASEÑA
  // ======================
  $("btn-change-pass").addEventListener("click", () => openPanel(panels.pass));

  $("save-pass").addEventListener("click", async () => {
    if (inputNew.value !== inputConfirm.value) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${user._id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: inputOld.value,
          newPassword: inputNew.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Contraseña actualizada");
      closePanel(panels.pass);
    } catch {
      alert("Error cambiando contraseña");
    }
  });

  $("cancel-pass").addEventListener("click", () => closePanel(panels.pass));
  $("cancel-pass-btn").addEventListener("click", () => closePanel(panels.pass));

  // ======================
  // ELIMINAR CUENTA
  // ======================
  $("btn-delete-account").addEventListener("click", () =>
    openPanel(panels.delete)
  );

  $("confirm-delete").addEventListener("click", async () => {
    const ok = confirm("¿Eliminar cuenta permanentemente?");
    if (!ok) return;

    await fetch(`${API_URL}/${user._id}`, { method: "DELETE" });

    localStorage.clear();
    window.location.href = "/Necli-main/index.html";
  });

  $("cancel-delete").addEventListener("click", () => closePanel(panels.delete));

  // ======================
  // LOGOUT
  // ======================
  $("btn-logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/Necli-main/index.html";
  });

  // ======================
  // BACK
  // ======================
  $("btn-back").addEventListener("click", () => {
    window.location.href = "/Necli-main/pages/home.html";
  });
});
