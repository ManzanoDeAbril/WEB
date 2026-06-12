<template>
  <div style="min-height:100vh; background:#f0f4f8; display:flex; align-items:center; justify-content:center;">
    <div style="background:white; border-radius:12px; padding:40px; width:100%; max-width:420px; box-shadow:0 4px 20px rgba(0,0,0,0.1);">

      <h2 style="text-align:center; color:#1e293b; margin-bottom:8px;">🔐 Nueva Contraseña</h2>
      <p style="text-align:center; color:#64748b; margin-bottom:28px; font-size:14px;">
        Ingresa el token que obtuviste y elige una nueva contraseña.
      </p>

      <form @submit.prevent="restablecer">
        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px;">
            Token de recuperación
          </label>
          <input
            v-model="token"
            type="text"
            placeholder="Pega aquí tu token..."
            required
            style="width:100%; padding:10px 12px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; font-family:monospace; box-sizing:border-box;"
          />
        </div>

        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px;">
            Nueva contraseña
          </label>
          <input
            v-model="nuevaPassword"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            style="width:100%; padding:10px 12px; border:1px solid #d1d5db; border-radius:8px; font-size:14px; box-sizing:border-box;"
          />
        </div>

        <div style="margin-bottom:20px;">
          <label style="display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px;">
            Confirmar contraseña
          </label>
          <input
            v-model="confirmar"
            type="password"
            placeholder="Repite la contraseña"
            required
            style="width:100%; padding:10px 12px; border:1px solid #d1d5db; border-radius:8px; font-size:14px; box-sizing:border-box;"
          />
          <p v-if="confirmar && nuevaPassword !== confirmar" style="color:#dc2626; font-size:12px; margin:4px 0 0;">
            Las contraseñas no coinciden
          </p>
        </div>

        <button
          type="submit"
          :disabled="cargando || (confirmar && nuevaPassword !== confirmar)"
          style="width:100%; padding:12px; background:#3b82f6; color:white; border:none; border-radius:8px; font-size:15px; font-weight:600; cursor:pointer;"
        >
          {{ cargando ? 'Guardando...' : 'Cambiar contraseña' }}
        </button>
      </form>

      <!-- Error -->
      <div v-if="error" style="margin-top:16px; padding:12px; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; color:#dc2626; font-size:14px;">
        ❌ {{ error }}
      </div>

      <!-- Éxito -->
      <div v-if="exito" style="margin-top:16px; padding:16px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; text-align:center;">
        <p style="color:#16a34a; font-weight:600; font-size:16px; margin:0 0 12px;">✅ ¡Contraseña actualizada!</p>
        <p style="color:#374151; font-size:14px; margin:0 0 16px;">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <button
          @click="navigateTo('/login')"
          style="padding:10px 24px; background:#3b82f6; color:white; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer;"
        >
          Ir al Login
        </button>
      </div>

      <div style="text-align:center; margin-top:20px;">
        <button @click="navigateTo('/solicitar-reset')" style="background:none; border:none; color:#3b82f6; cursor:pointer; font-size:14px; text-decoration:underline;">
          ← Solicitar otro token
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const BASE   = config.public.apiBase
const route  = useRoute()

// Precarga el token si viene por query param
const token         = ref(route.query.token || '')
const nuevaPassword = ref('')
const confirmar     = ref('')
const cargando      = ref(false)
const error         = ref('')
const exito         = ref(false)

const restablecer = async () => {
  if (nuevaPassword.value !== confirmar.value) return
  error.value  = ''
  exito.value  = false
  cargando.value = true

  try {
    await $fetch(`${BASE}/auth/restablecer-password`, {
      method: 'POST',
      body: {
        token: token.value,
        nueva_password: nuevaPassword.value
      }
    })
    exito.value = true
  } catch (e) {
    error.value = e?.data?.error || 'Error al restablecer la contraseña'
  } finally {
    cargando.value = false
  }
}
</script>