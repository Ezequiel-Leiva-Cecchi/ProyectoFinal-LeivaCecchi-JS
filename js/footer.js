document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email-ofertas");
    const botonSuscribirse = document.querySelector(".suscribirse");

    botonSuscribirse.addEventListener("click", function () {
        const email = emailInput.value;

        if (emailValidator(email)) {
            // Guardar el correo electrónico en localStorage
            localStorage.setItem("userEmail", email);
            Swal.fire({
                icon: 'success',
                title: 'Igresado',
                text: 'Se a ingresado exitosamente se le enviara ofertas cuando esten disponibles.'
              });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algun valor que ingresaste es invalido, vuelva a intentarlo.'
              });
        }
    });

    const emailValidator = (email) => {
        const patronEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return patronEmail.test(email);
    }
});