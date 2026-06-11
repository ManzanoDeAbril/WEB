<script setup>
import { ref } from 'vue'
import { API_URL } from '../composables/api'

definePageMeta({
  middleware: 'auth'
})

const fechaInicio  = ref('');
const fechaFin     = ref('');
const vehiculos    = ref([]);
const buscado      = ref(false);
const cargando     = ref(false);
const error        = ref('');

async function buscar() {

  error.value = ''
  vehiculos.value = []
  buscado.value = false

  if (!fechaInicio.value || !fechaFin.value) {
    error.value = 'Completa ambas fechas'
    return
  }

  cargando.value = true

  try {

    const params = new URLSearchParams({
      fecha_inicio: fechaInicio.value,
      fecha_fin: fechaFin.value
    })

    const token = localStorage.getItem('token')

    const response = await fetch(
      `${API_URL}/vehiculos/disponibles?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      error.value = data.error
      return
    }

    vehiculos.value = data.vehiculos
    buscado.value = true

  } catch (e) {

    error.value = 'Error de conexión'

  } finally {

    cargando.value = false

  }

}

function logout() {
  localStorage.removeItem('token');
  navigateTo('/login');
}
</script>

<template>
  <div class="page">
    <!-- Navbar -->
    <nav class="navbar">
      <span class="brand">🚗 Rent-a-Car</span>
      <div class="nav-links">
        <button @click="navigateTo('/vehiculos')">Vehículos</button>
        <button @click="navigateTo('/reservas')">Reservas</button>
        <button class="active" @click="navigateTo('/disponibilidad')">Disponibilidad</button>
        <button class="logout" @click="logout">Cerrar sesión</button>
      </div>
    </nav>

    <main class="container">
      <h1>Disponibilidad de vehículos</h1>
      <p class="subtitle">Consultá qué vehículos están libres en un rango de fechas.</p>

      <!-- Formulario de búsqueda -->
      <div class="search-card">
        <div class="form-row">
          <div class="field">
            <label>Fecha inicio</label>
            <input type="date" v-model="fechaInicio" />
          </div>
          <div class="field">
            <label>Fecha fin</label>
            <input type="date" v-model="fechaFin" />
          </div>
          <button class="btn-buscar" :disabled="cargando" @click="buscar">
            {{ cargando ? 'Buscando…' : '🔍 Buscar disponibilidad' }}
          </button>
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>

      <!-- Resultados -->
      <div v-if="buscado">
        <div v-if="vehiculos.length === 0" class="empty">
          😕 No hay vehículos disponibles para ese período.
        </div>
        <div v-else>
          <p class="result-count">✅ {{ vehiculos.length }} vehículo(s) disponible(s)</p>
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Patente</th>
                <th>Color</th>
                <th>Kilometraje</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in vehiculos" :key="v.id">
                <td>{{ v.id }}</td>
                <td>{{ v.marca }}</td>
                <td>{{ v.modelo }}</td>
                <td>{{ v.anio }}</td>
                <td>{{ v.patente }}</td>
                <td>{{ v.color }}</td>
                <td>{{ v.kilometraje?.toLocaleString() }} km</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #f0f4f8; }
.navbar { display:flex; justify-content:space-between; align-items:center;
  background:#1e3a5f; color:#fff; padding:0.75rem 2rem; }
.brand { font-size:1.2rem; font-weight:700; }
.nav-links { display:flex; gap:0.5rem; }
.nav-links button { background:transparent; border:1px solid rgba(255,255,255,.3);
  color:#fff; padding:0.4rem 0.9rem; border-radius:6px; cursor:pointer; }
.nav-links button:hover, .nav-links button.active { background:rgba(255,255,255,.15); }
.nav-links .logout { border-color:#e57373; color:#e57373; }

.container { max-width:960px; margin:2rem auto; padding:0 1rem; }
h1 { color:#1e3a5f; margin-bottom:0.25rem; }
.subtitle { color:#666; margin-bottom:1.5rem; }

.search-card { background:#fff; border-radius:12px; padding:1.5rem;
  box-shadow:0 2px 8px rgba(0,0,0,.08); margin-bottom:2rem; }
.form-row { display:flex; gap:1rem; align-items:flex-end; flex-wrap:wrap; }
.field { display:flex; flex-direction:column; gap:0.3rem; }
.field label { font-size:.85rem; color:#555; font-weight:600; }
.field input { padding:0.5rem 0.75rem; border:1px solid #d0d7de;
  border-radius:8px; font-size:1rem; }
.btn-buscar { padding:0.55rem 1.4rem; background:#1e3a5f; color:#fff;
  border:none; border-radius:8px; font-size:1rem; cursor:pointer; }
.btn-buscar:hover { background:#2a5298; }
.btn-buscar:disabled { opacity:.6; cursor:not-allowed; }
.error-msg { color:#c62828; margin-top:.75rem; font-size:.9rem; }

.result-count { color:#2e7d32; font-weight:600; margin-bottom:1rem; }
.empty { background:#fff3e0; border:1px solid #ffe082; border-radius:10px;
  padding:1.5rem; text-align:center; color:#795548; font-size:1.05rem; }

.table { width:100%; border-collapse:collapse; background:#fff;
  border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
.table th { background:#1e3a5f; color:#fff; padding:.75rem 1rem; text-align:left; }
.table td { padding:.65rem 1rem; border-bottom:1px solid #f0f4f8; }
.table tr:hover td { background:#f8fafc; }
</style>