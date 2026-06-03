const form = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    try {

        const respuesta = await fetch(
            'http://localhost:3000/usuarios/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = resultado.error;
            return;
        }

        localStorage.setItem(
            'token',
            resultado.token
        );

        mensaje.textContent = 'Login correcto';

        window.location.href = 'dashboard.html';

    } catch (error) {

        mensaje.textContent = 'Error de conexión';

    }

});