document.addEventListener("DOMContentLoaded", () => {
  const ids = {
    btnBack: "btn-back",
    btnUpdate: "btn-update-info",
    btnChangePass: "btn-change-pass",
    btnDelete: "btn-delete-account",
    btnHelp: "btn-help",
    btnLogout: "btn-logout",
    panelUpdate: "panel-update",
    panelPass: "panel-change-pass",
    panelDelete: "panel-delete",
    panelHelp: "panel-help",
  };

  const $ = (id) => document.getElementById(id);

  const panels = {
    update: $(ids.panelUpdate),
    pass: $(ids.panelPass),
    delete: $(ids.panelDelete),
    help: $(ids.panelHelp),
  };

  // Forms / inputs
  const inputName = $("input-name");
  const inputDocument = $("input-doc");
  const inputPhone = $("input-phone");
  const inputEmail = $("input-email");
  const inputAge = $("input-age");

  const inputOld = $("input-oldpass");
  const inputNew = $("input-newpass");
  const inputConfirm = $("input-confirm");
  const formPass = $("form-pass");

  // Botones internos de los paneles
  const btnSaveUpdate = $("save-update");
  const btnCancelUpdate = $("cancel-update");
  const btnCancelUpdateBtn = $("cancel-update-btn");

  const btnSavePass = $("save-pass");
  const btnCancelPass = $("cancel-pass");
  const btnCancelPassBtn = $("cancel-pass-btn");

  const btnConfirmDelete = $("confirm-delete");
  const btnCancelDelete = $("cancel-delete");

  const btnCloseHelp = $("close-help");

  function openPanel(panelEl) {
    Object.values(panels).forEach((p) => p.setAttribute("aria-hidden", "true"));
    panelEl.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  }

  function closePanel(panelEl) {
    panelEl.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  }

  const STORAGE_KEY = "necli_settings_v1";

  function saveState(partial = {}) {
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const next = Object.assign({}, prev, partial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function loadState() {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (state.user) {
      inputName.value = state.user.name || "";
      inputEmail.value = state.user.email || "";
      const titleEl = document.getElementById("user-name");
      if (state.user.name) titleEl.textContent = state.user.name;
    }
  }

  // Guardar formularios actualizar información
  function saveUpdateForm() {
    const user = {
      name: inputName.value.trim(),
      document: inputDocument.value.trim(),
      phone: inputPhone.value.trim(),
      email: inputEmail.value.trim(),
      age: inputAge.value.trim(),
    };
    saveState({ user });
    if (user.name) document.getElementById("user-name").textContent = user.name;
  }

  // Simulación de guardar nueva contraseña
  function savePasswordMock() {
    saveState({ passwordChangedAt: new Date().toISOString() });
  }

  // acciones paneles
  $(ids.btnUpdate).addEventListener("click", () => {
    inputName.value = "";
    inputDocument.value = "";
    inputPhone.value = "";
    inputEmail.value = "";
    inputAge.value = "";

    openPanel(panels.update);
  });

  $(ids.btnChangePass).addEventListener("click", () => openPanel(panels.pass));
  $(ids.btnDelete).addEventListener("click", () => openPanel(panels.delete));
  $(ids.btnHelp).addEventListener("click", () => openPanel(panels.help));

  $(ids.btnBack).addEventListener("click", (e) => {
    e.preventDefault();
    saveUpdateForm();
    Object.values(panels).forEach((p) => p.setAttribute("aria-hidden", "true"));
    window.location.href = "/Necli-main/pages/home.html";
  });

  // botón Logout
  $(ids.btnLogout).addEventListener("click", () => {
    const ok = confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (ok) {
      console.log("Sesión cerrada");
      window.location.href = "/Necli-main/index.html";
    } else {
      console.log("Cierre de sesión cancelado");
    }
  });

  // Panel Actualizar información
  btnCancelUpdate.addEventListener("click", () => {
    saveUpdateForm();
    closePanel(panels.update);
  });

  btnCancelUpdateBtn.addEventListener("click", () => {
    saveUpdateForm();
    alert("Los cambios no se guardaron.");
    closePanel(panels.update);
  });

  btnSaveUpdate.addEventListener("click", () => {
    saveUpdateForm();
    alert("Información guardada correctamente.");
    formPass.reset();
    closePanel(panels.update);
  });

  // Panel cambiar contraseña
  btnCancelPass.addEventListener("click", () => {
    closePanel(panels.pass);
  });

  btnCancelPassBtn.addEventListener("click", () => {
    saveUpdateForm();
    alert("Los cambios no se guardaron.");
    closePanel(panels.pass);
  });

  btnSavePass.addEventListener("click", () => {
    const newp = inputNew.value || "";
    const conf = inputConfirm.value || "";
    /*const oldp = getCurrentPassword(); */

    if (!newp || newp.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    /*
    if (newp === oldp) {
      alert("La nueva contraseña debe ser diferente a la actual.");
      return;
    }
    */
    if (newp !== conf) {
      alert("La confirmación no coincide.");
      return;
    }
    savePasswordMock();
    alert("Contraseña actualizada.");
    formPass.reset();
    closePanel(panels.pass);
  });

  // Panel eliminar cuenta
  btnCancelDelete.addEventListener("click", () => closePanel(panels.delete));
  btnConfirmDelete.addEventListener("click", () => {
    const ok = confirm("¿Deseas eliminar la cuenta y todos los datos?");
    if (ok) performDeleteAccount();
  });

  btnCloseHelp.addEventListener("click", () => closePanel(panels.help));

  function performDeleteAccount() {
    localStorage.removeItem(STORAGE_KEY);
    alert(
      "Tu cuenta ha sido eliminada. Serás redireccionado a la pantalla de inicio."
    );
    window.location.href = "/Necli-main/index.html";
  }

  loadState();

  const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  if (state.openPanel) {
    const mapping = {
      update: panels.update,
      pass: panels.pass,
      delete: panels.delete,
      help: panels.help,
    };
    if (mapping[state.openPanel]) openPanel(mapping[state.openPanel]);
  }

  window.addEventListener("beforeunload", () => {
    saveUpdateForm();
    const openKey = Object.entries(panels).find(
      ([, el]) => el.getAttribute("aria-hidden") === "false"
    );
    if (openKey) saveState({ openPanel: openKey[0] });
    else saveState({ openPanel: null });
  });
});
