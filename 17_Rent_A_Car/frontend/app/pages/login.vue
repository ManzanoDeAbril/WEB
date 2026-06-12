<template>
  <div class="login-container">
    <div class="road-strip">
      <div class="dashes"></div>
    </div>

    <div class="login-card">
      <div class="login-header">
        <div class="brand">
          <span class="brand-icon">🚗</span>
          <h1>Rent<span class="brand-accent">A</span>Car</h1>
        </div>
        <p>Accede a tu cuenta</p>
      </div>

      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">Correo electrónico</label>
          <div class="input-wrapper">
            <span class="input-icon-left">📧</span>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="ejemplo@correo.com"
              autocomplete="email"
              required
            />
          </div>
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <span class="input-icon-left">🔑</span>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingresa tu contraseña"
              autocomplete="current-password"
              required
            />
            <span class="input-icon-right" @click="showPassword = !showPassword">
              {{ showPassword ? '👁️' : '🙈' }}
            </span>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Iniciar sesión</span>
        </button>

        <div style="text-align:center; margin-top:12px;">
  <button
    @click="navigateTo('/solicitar-reset')"
    style="background:none; border:none; color:#3b82f6; cursor:pointer; font-size:13px; text-decoration:underline;"
  >
    ¿Olvidaste tu contraseña?
  </button>
</div>

        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>

        <div class="register-link">
          ¿No tienes cuenta?
          <NuxtLink to="/register">Regístrate aquí</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_URL } from '../composables/api'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const login = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.error || 'Credenciales inválidas'
      loading.value = false
      return
    }

    localStorage.setItem('token', data.token)
    navigateTo('/panel')
  } catch (err) {
    error.value = 'Error de conexión con el servidor'
    loading.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');

/* ── Layout ── */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f0f1a;
  font-family: 'Inter', sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* ── Road strip (firma visual) ── */
.road-strip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #1a1a2e;
  border-top: 2px solid #2a2a45;
  overflow: hidden;
}

.dashes {
  position: absolute;
  top: 50%;
  left: -120px;
  right: 0;
  height: 4px;
  margin-top: -2px;
  background: repeating-linear-gradient(
    to right,
    #f59e0b 0px,
    #f59e0b 40px,
    transparent 40px,
    transparent 80px
  );
  animation: drive 1.4s linear infinite;
}

@keyframes drive {
  from { transform: translateX(0); }
  to   { transform: translateX(80px); }
}

/* ── Card ── */
.login-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  padding: 40px 36px;
  position: relative;
  z-index: 1;
}

/* ── Header / Brand ── */
.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.brand-icon {
  font-size: 28px;
}

.brand h1 {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
  margin: 0;
}

.brand-accent {
  color: #f59e0b;
}

.login-header p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.3px;
  margin: 0;
}

/* ── Inputs ── */
.input-group {
  margin-bottom: 22px;
}

.input-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon-left {
  position: absolute;
  left: 14px;
  font-size: 16px;
  pointer-events: none;
  opacity: 0.6;
}

.input-icon-right {
  position: absolute;
  right: 14px;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.input-icon-right:hover {
  opacity: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 13px 40px 13px 42px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  box-sizing: border-box;
  outline: none;
}

.input-wrapper input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.input-wrapper input:focus {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.06);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
}

/* ── Button ── */
.login-btn {
  width: 100%;
  background: #f59e0b;
  border: none;
  color: #0f0f1a;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.2px;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.login-btn:hover:not(:disabled) {
  background: #fbbf24;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Spinner ── */
.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(15, 15, 26, 0.25);
  border-radius: 50%;
  border-top-color: #0f0f1a;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Error ── */
.error-message {
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
  padding: 12px 14px;
  border-radius: 10px;
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

/* ── Register link ── */
.register-link {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
}

.register-link a {
  color: #f59e0b;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
  transition: color 0.2s;
}

.register-link a:hover {
  color: #fbbf24;
  text-decoration: underline;
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .dashes { animation: none; }
  .spinner { animation: none; }
}
</style>