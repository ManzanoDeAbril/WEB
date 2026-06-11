<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>🚗 Rent A Car</h1>
        <p>Crea tu cuenta</p>
      </div>

      <form @submit.prevent="registrar">
        <div class="input-group">
          <label for="nombre">Nombre completo</label>
          <input
            id="nombre"
            v-model="nombre"
            type="text"
            placeholder="Ej: Juan Pérez"
            autocomplete="name"
            required
          />
          <span class="input-icon">👤</span>
        </div>

        <div class="input-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="ejemplo@correo.com"
            autocomplete="email"
            required
          />
          <span class="input-icon">📧</span>
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Ingresa tu contraseña"
            autocomplete="new-password"
            required
          />
          <span class="input-icon" @click="showPassword = !showPassword" style="cursor:pointer;">
            {{ showPassword ? '👁️' : '🔒' }}
          </span>
        </div>

        <button type="submit" :disabled="cargando" class="register-btn">
          <span v-if="cargando" class="spinner"></span>
          <span v-else>Registrarse</span>
        </button>

        <div v-if="mensaje" class="success-message">
          ✅ {{ mensaje }}
        </div>
        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>

        <div class="login-link">
          ¿Ya tienes cuenta?
          <NuxtLink to="/login">Inicia sesión aquí</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_URL } from '../composables/api'

const nombre = ref('')
const email = ref('')
const password = ref('')
const mensaje = ref('')
const error = ref('')
const cargando = ref(false)
const showPassword = ref(false)

const registrar = async () => {
  mensaje.value = ''
  error.value = ''
  cargando.value = true

  try {
    const response = await fetch(`${API_URL}/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.error || 'Error al registrar usuario'
      cargando.value = false
      return
    }

    mensaje.value = 'Usuario registrado correctamente'
    setTimeout(() => {
      navigateTo('/login')
    }, 1500)

  } catch (err) {
    error.value = 'Error de conexión con el servidor'
    cargando.value = false
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  padding: 30px 28px;
  transition: transform 0.3s ease;
}

.register-card:hover {
  transform: translateY(-5px);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.register-header p {
  color: #718096;
  margin-top: 8px;
  font-size: 14px;
}

.input-group {
  position: relative;
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 6px;
}

.input-group input {
  width: 100%;
  padding: 12px 40px 12px 40px;
  font-size: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s;
  background-color: #f7fafc;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  background-color: #fff;
}

.input-icon {
  position: absolute;
  left: 14px;
  bottom: 12px;
  font-size: 18px;
  color: #a0aec0;
}

.input-group .input-icon:last-child {
  left: auto;
  right: 14px;
  cursor: pointer;
}

.register-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 700;
  font-size: 16px;
  padding: 14px;
  border-radius: 40px;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.register-btn:hover:not(:disabled) {
  transform: scale(1.02);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  background: #eafaf1;
  color: #1e8449;
  padding: 12px;
  border-radius: 12px;
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  border-left: 4px solid #27ae60;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 12px;
  border-radius: 12px;
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  border-left: 4px solid #e53e3e;
}

.login-link {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #4a5568;
}

.login-link a {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>