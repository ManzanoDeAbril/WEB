<script setup>
import { ref } from 'vue'
import { API_URL } from '../composables/api'

const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {

  error.value = ''

  try {

    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.error
      return
    }

    localStorage.setItem('token', data.token)

    navigateTo('/panel')

  } catch (err) {

    error.value = 'Error de conexión'

  }

}
</script>

<template>

  <div>
    <h1>Login Rent A Car</h1>

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

    <button @click="login">
      Iniciar sesión
    </button>

    <NuxtLink to="/register">
     Crear cuenta
    </NuxtLink>

    <p>{{ error }}</p>  

  </div>

</template>