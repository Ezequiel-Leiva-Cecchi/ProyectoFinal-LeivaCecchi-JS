document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("contraseña").value;
        const storedDataString = localStorage.getItem("dataOfTheForm");

        // Verificar si los datos recuperados de localStorage son null
        if (storedDataString === null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No hay datos almacenados. Regístrese primero.'
            });
            return; // Salir de la función si no hay datos
        }

        const storedData = JSON.parse(storedDataString);

        // Verificar si 'email' está definido en los datos almacenados
        if (!storedData || !storedData.email) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se encontró un correo electrónico almacenado.'
            });
            return; // Salir de la función si no hay un correo electrónico almacenado
        }

        const storedEmail = storedData.email;
        const storedPassword = atob(storedData.password);

        // Verificar las credenciales ingresadas por el usuario
        if (email === storedEmail && password === storedPassword) {
            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: 'Se ha iniciado la cuenta exitosamente.'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las credenciales ingresadas son incorrectas. Vuelve a intentarlo.'
            });
        }
    });
});




