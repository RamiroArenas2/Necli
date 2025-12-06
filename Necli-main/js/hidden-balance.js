const balance = document.getElementById("balance");
const balanceHidden = document.getElementById("balance-hidden");

const eyeOpen = document.getElementById("eye-open");
const eyeClosed = document.getElementById("eye-closed");

const btn = document.getElementById("toggle-balance");

btn.addEventListener("click", () => {
  const isVisible = !balance.classList.contains("hidden");

  if (isVisible) {
    balance.classList.add("hidden");
    balanceHidden.classList.remove("hidden");

    eyeOpen.classList.remove("hidden");
    eyeClosed.classList.add("hidden");
  } else {
    balance.classList.remove("hidden");
    balanceHidden.classList.add("hidden");

    eyeOpen.classList.add("hidden");
    eyeClosed.classList.remove("hidden");
  }
});
