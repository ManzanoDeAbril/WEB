<template>
  <div class="page-wrapper">
    <div class="card">
      <h1 class="card-title">🔑 Recuperar Contraseña</h1>
      <p class="card-subtitle">
        Ingresa tu email y recibirás un token para restablecer tu contraseña.
      </p>

      <form @submit.prevent="solicitar">
        <label class="field-label">Correo electrónico</label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="tu@email.com"
          class="field-input"
        />

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Solicitando...' : 'Solicitar Token' }}
        </button>
      </form>

      <!-- Error -->
      <div v-if="error" class="alert alert-error">
        ✖ {{ error }}
      </div>

      <!-- Éxito -->
      <div v-if="tokenDev" class="alert alert-success">
        <p class="token-label">✅ Token generado (modo dev):</p>
        <code class="token-box">{{ tokenDev }}</code>
        <button @click="irARestablecer" class="btn-success">
          Restablecer contraseña →
        </button>
      </div>

      <div class="back-link">
        <NuxtLink to="/login">← Volver al login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>

import { API_URL } from '../composables/api'

const email = ref('')
const loading = ref(false)
const error = ref('')
const tokenDev = ref('')

async function solicitar() {
  loading.value = true
  error.value = ''
  tokenDev.value = ''

  try {
  const data = await $fetch(`${API_URL}/auth/solicitar-reset`, {      method: 'POST',
      body: { email: email.value },
    })
    tokenDev.value = data.token_dev || ''
  } catch (e) {
    const raw = e?.data?.error ?? e?.data?.message ?? e?.message ?? 'Error desconocido'
    error.value = typeof raw === 'string' ? raw : JSON.stringify(raw)
  } finally {
    loading.value = false
  }
}

function irARestablecer() {
  navigateTo(`/restablecer-password?token=${tokenDev.value}`)
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
}
.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: #1f2937;
  margin-bottom: 0.25rem;
}
.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
}
.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}
.field-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}
.field-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
}
.btn-primary {
  width: 100%;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}
.btn-primary:hover:not(:disabled) { background: #1d4ed8; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.alert {
  margin-top: 1rem;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}
.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}
.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}
.token-label { font-weight: 600; margin-bottom: 0.5rem; }
.token-box {
  display: block;
  background: #fff;
  border: 1px solid #86efac;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  word-break: break-all;
  color: #1f2937;
  margin-bottom: 0.75rem;
}
.btn-success {
  width: 100%;
  background: #16a34a;
  color: #fff;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}
.btn-success:hover { background: #15803d; }

.back-link {
  margin-top: 1.5rem;
  text-align: center;
}
.back-link a {
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
}
.back-link a:hover { text-decoration: underline; }
</style>