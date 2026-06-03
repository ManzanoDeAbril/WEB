const form = document.getElementById('registroForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const datos = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {

        const respuesta = await fetch(
            'http://localhost:3000/usuarios/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = resultado.error;
            return;
        }

        mensaje.textContent = 'Usuario registrado correctamente';

        form.reset();

    } catch (error) {

        mensaje.textContent = 'Error al conectar con la API';

    }

});