// inicio de session
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("contraseña").value;
        const storedDataString = localStorage.getItem("dataOfTheForm");
        const storedData = JSON.parse(storedDataString);
        const storedEmail = storedData.email;
        const storedPassword = atob(storedData.password);
        console.log(storedData, storedEmail, storedPassword)
        if (storedEmail === email && storedPassword === password) {
            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: 'Se a iniciado la cuenta exsitosamente.'
              });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algun valor que ingresaste es invalido, vuelva a intentarlo.'
              });
        }

    });
});





