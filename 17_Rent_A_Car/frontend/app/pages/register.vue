<script setup>
import { ref } from 'vue'
import { API_URL } from '../composables/api'

const nombre = ref('')
const email = ref('')
const password = ref('')
const mensaje = ref('')
const error = ref('')

const registrar = async () => {

  mensaje.value = ''
  error.value = ''

  try {

    const response = await fetch(
      `${API_URL}/usuarios/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre.value,
          email: email.value,
          password: password.value
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      error.value = data.error
      return
    }

    mensaje.value = 'Usuario registrado correctamente'

    setTimeout(() => {
      navigateTo('/login')
    }, 1500)

  } catch (err) {

    error.value = 'Error de conexión'

  }

}
</script>

<template>

  <div>

    <h1>Registro de Usuario</h1>

    <input
      v-model="nombre"
      placeholder="Nombre"
    >

    <br><br>

    <input
      v-model="email"
      placeholder="Correo"
    >

    <br><br>

    <input
      v-model="password"
      type="password"
      placeholder="Contraseña"
    >

    <br><br>

    <button @click="registrar">
      Registrarse
    </button>

    <br><br>

    <NuxtLink to="/login">
      Ir al Login
    </NuxtLink>

    <p>{{ mensaje }}</p>
    <p>{{ error }}</p>

  </div>

</template>