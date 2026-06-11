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
      <span class="brand">🚗 Rent<span class="brand-accent">A</span>Car</span>
      <div class="nav-links">
        <button @click="navigateTo('/vehiculos')">Vehículos</button>
        <button @click="navigateTo('/reservas')">Reservas</button>
        <button class="active" @click="navigateTo('/disponibilidad')">Disponibilidad</button>
        <button @click="navigateTo('/panel')">Panel</button>
        <button @click="navigateTo('/rq-10')" class="nav-btn">
          Extras & Multas
        </button>
        <button class="logout" @click="logout">Cerrar sesión</button>
      </div>
    </nav>

    <main class="container">
      <div class="page-header">
        <h1>Disponibilidad</h1>
        <p class="subtitle">Consultá qué vehículos están libres en un rango de fechas.</p>
      </div>

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
            <span v-if="cargando" class="spinner"></span>
            <span v-else>🔍 Buscar disponibilidad</span>
          </button>
        </div>
        <p v-if="error" class="error-msg">⚠️ {{ error }}</p>
      </div>

      <!-- Resultados -->
      <div v-if="buscado">
        <div v-if="vehiculos.length === 0" class="empty">
          <span class="empty-icon">😕</span>
          <p>No hay vehículos disponibles para ese período.</p>
        </div>
        <div v-else>
          <p class="result-count">
            <span class="result-badge">{{ vehiculos.length }}</span>
            vehículo{{ vehiculos.length !== 1 ? 's' : '' }} disponible{{ vehiculos.length !== 1 ? 's' : '' }}
          </p>
          <div class="table-wrapper">
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
                  <td><span class="id-badge">{{ v.id }}</span></td>
                  <td><strong>{{ v.marca }}</strong></td>
                  <td>{{ v.modelo }}</td>
                  <td>{{ v.anio }}</td>
                  <td><span class="patente">{{ v.patente }}</span></td>
                  <td>{{ v.color }}</td>
                  <td class="km">{{ v.kilometraje?.toLocaleString() }} km</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Road strip -->
    <div class="road-strip">
      <div class="dashes"></div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ── Base ── */
*, *::before, *::after { box-sizing: border-box; }

.page {
  min-height: 100vh;
  background: #0f0f1a;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  padding-bottom: 72px;
  position: relative;
}

/* ── Navbar ── */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 2rem;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.brand {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.brand-accent {
  color: #f59e0b;
}

.nav-links {
  display: flex;
  gap: 0.4rem;
}

.nav-links button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.55);
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.nav-links button:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.nav-links button.active {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.4);
  color: #f59e0b;
}

.nav-links .logout {
  border-color: rgba(239, 68, 68, 0.3);
  color: rgba(239, 68, 68, 0.7);
}

.nav-links .logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

/* ── Container ── */
.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

/* ── Page header ── */
.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.3rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.9rem;
  margin: 0;
}

/* ── Search card ── */
.search-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

.field input[type="date"] {
  padding: 0.55rem 0.85rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9px;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  color-scheme: dark;
}

.field input[type="date"]:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
}

.btn-buscar {
  padding: 0.6rem 1.4rem;
  background: #f59e0b;
  color: #0f0f1a;
  border: none;
  border-radius: 9px;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  white-space: nowrap;
}

.btn-buscar:hover:not(:disabled) {
  background: #fbbf24;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
}

.btn-buscar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(15, 15, 26, 0.25);
  border-radius: 50%;
  border-top-color: #0f0f1a;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-msg {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  margin-top: 1rem;
  font-size: 0.85rem;
}

/* ── Results ── */
.result-count {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
}

.result-badge {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.15rem 0.55rem;
  border-radius: 20px;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.empty {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 3rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
}

.empty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.empty p {
  margin: 0;
  font-size: 0.95rem;
}

/* ── Table ── */
.table-wrapper {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.03);
}

.table th {
  background: rgba(245, 158, 11, 0.08);
  color: rgba(245, 158, 11, 0.8);
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.table td {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover td {
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
}

.id-badge {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-weight: 600;
}

.patente {
  font-family: 'Courier New', monospace;
  background: rgba(245, 158, 11, 0.08);
  color: #f59e0b;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  letter-spacing: 1px;
  border: 1px solid rgba(245, 158, 11, 0.15);
}

.km {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
}

/* ── Road strip ── */
.road-strip {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
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

@media (prefers-reduced-motion: reduce) {
  .dashes { animation: none; }
  .spinner { animation: none; }
}

@media (max-width: 640px) {
  .navbar { padding: 0 1rem; }
  .nav-links button { padding: 0.35rem 0.6rem; font-size: 0.78rem; }
  .form-row { flex-direction: column; align-items: stretch; }
  .btn-buscar { justify-content: center; }
}
</style>