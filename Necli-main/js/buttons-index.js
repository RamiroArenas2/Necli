document.addEventListener("DOMContentLoaded" , () => {
    const btnCreate = document.querySelector("#Create-necli");
    const btnIngresa = document.querySelector("#loguin");

    btnCreate.addEventListener("click" , () => {
        window.location.href = "/Necli-main/pages/register.html"
    })

 btnIngresa.addEventListener("click" , () => {
        window.location.href = "/Necli-main/pages/login.html"
    })
});