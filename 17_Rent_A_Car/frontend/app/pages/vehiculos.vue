<template>
  <div class="page">

    <!-- ── Navbar ── -->
    <nav class="navbar">
      <span class="brand">🚗 Rent<span class="brand-accent">A</span>Car</span>
      <div class="nav-links">
        <button @click="navigateTo('/panel')">Panel</button>
        <button class="active" @click="navigateTo('/vehiculos')">Vehículos</button>
        <button @click="navigateTo('/reservas')">Reservas</button>
        <button @click="navigateTo('/disponibilidad')">Disponibilidad</button>
        <button @click="navigateTo('/rq-10')">Extras & Multas</button>
        <button class="logout" @click="logout">Cerrar sesión</button>
      </div>
    </nav>

    <main class="container">
      <div class="page-header">
        <h1>Gestión de Vehículos</h1>
        <p class="subtitle">Administrá la flota: creá, editá y eliminá vehículos.</p>
      </div>

      <!-- ── Formulario ── -->
      <div class="card">
        <h2 class="card-title">{{ editandoId ? '✏️ Editar Vehículo' : '➕ Nuevo Vehículo' }}</h2>

        <div class="form-grid">
          <div class="field">
            <label>Marca</label>
            <input v-model="marca" type="text" placeholder="Ej: Toyota" />
          </div>
          <div class="field">
            <label>Modelo</label>
            <input v-model="modelo" type="text" placeholder="Ej: Corolla" />
          </div>
          <div class="field">
            <label>Año</label>
            <input v-model="anio" type="number" placeholder="Ej: 2024" />
          </div>
          <div class="field">
            <label>Patente</label>
            <input v-model="patente" type="text" placeholder="Ej: ABCD12" />
          </div>
          <div class="field">
            <label>Color</label>
            <input v-model="color" type="text" placeholder="Ej: Rojo" />
          </div>
        </div>

        <div class="form-actions">
          <button v-if="!editandoId" class="btn btn-create" @click="crearVehiculo">
            ✚ Crear Vehículo
          </button>
          <button v-else class="btn btn-save" @click="actualizarVehiculo">
            💾 Actualizar Vehículo
          </button>
          <button v-if="editandoId" class="btn btn-cancel" @click="limpiarFormulario">
            ✖ Cancelar
          </button>
        </div>
      </div>

      <!-- ── Tabla ── -->
      <h2 class="section-title">Listado de Vehículos</h2>

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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vehiculo in vehiculos" :key="vehiculo.id">
              <td><span class="id-badge">{{ vehiculo.id }}</span></td>
              <td><strong>{{ vehiculo.marca }}</strong></td>
              <td>{{ vehiculo.modelo }}</td>
              <td class="muted">{{ vehiculo.anio }}</td>
              <td><span class="patente">{{ vehiculo.patente }}</span></td>
              <td class="muted">{{ vehiculo.color }}</td>
              <td class="actions-cell">
                <button class="btn-action btn-edit" @click="editarVehiculo(vehiculo)">✏️ Editar</button>
                <button class="btn-action btn-delete" @click="eliminarVehiculo(vehiculo.id)">🗑️ Eliminar</button>
              </td>
            </tr>
            <tr v-if="vehiculos.length === 0">
              <td colspan="7" class="empty-row">No hay vehículos registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Road strip -->
    <div class="road-strip"><div class="dashes"></div></div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
import { ref, onMounted } from 'vue'
import { API_URL } from '../composables/api'

const vehiculos = ref([])
const marca     = ref('')
const modelo    = ref('')
const anio      = ref('')
const patente   = ref('')
const color     = ref('')
const editandoId = ref(null)

const cargarVehiculos = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL}/vehiculos`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  vehiculos.value = await response.json()
}

const crearVehiculo = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL}/vehiculos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      marca: marca.value, modelo: modelo.value, anio: anio.value,
      patente: patente.value, color: color.value, kilometraje: 0, disponible: true
    })
  })
  if (response.ok) { limpiarFormulario(); cargarVehiculos() }
}

const editarVehiculo = (vehiculo) => {
  editandoId.value = vehiculo.id
  marca.value      = vehiculo.marca
  modelo.value     = vehiculo.modelo
  anio.value       = vehiculo.anio
  patente.value    = vehiculo.patente
  color.value      = vehiculo.color
}

const actualizarVehiculo = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL}/vehiculos/${editandoId.value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      marca: marca.value, modelo: modelo.value, anio: anio.value,
      patente: patente.value, color: color.value, kilometraje: 0, disponible: true
    })
  })
  if (response.ok) { limpiarFormulario(); cargarVehiculos() }
}

const eliminarVehiculo = async (id) => {
  const token = localStorage.getItem('token')
  await fetch(`${API_URL}/vehiculos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  cargarVehiculos()
}

const limpiarFormulario = () => {
  editandoId.value = null
  marca.value = ''; modelo.value = ''; anio.value = ''
  patente.value = ''; color.value = ''
}

const logout = () => {
  localStorage.removeItem('token')
  navigateTo('/login')
}

onMounted(() => cargarVehiculos())
</script>

<style>
html, body { margin: 0; padding: 0; background: #0f0f1a; }
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.page {
  min-height: 100vh;
  background: #0f0f1a;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  padding-bottom: 72px;
}

/* ── Navbar ── */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 0 2rem;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.brand { font-size: 1.1rem; font-weight: 800; color: #fff; letter-spacing: -0.3px; white-space: nowrap; }
.brand-accent { color: #f59e0b; }

.nav-links { display: flex; gap: 0.4rem; flex-wrap: wrap; }

.nav-links button {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.5);
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.nav-links button:hover { background: rgba(255,255,255,0.08); color: #fff; }
.nav-links button.active {
  background: rgba(245,158,11,0.12);
  border-color: rgba(245,158,11,0.4);
  color: #f59e0b;
}
.nav-links .logout { border-color: rgba(239,68,68,0.3); color: rgba(239,68,68,0.7); }
.nav-links .logout:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }

/* ── Container ── */
.container { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }

.page-header { margin-bottom: 1.75rem; }
.page-header h1 { font-size: 1.75rem; font-weight: 800; color: #fff; margin: 0 0 0.3rem; letter-spacing: -0.5px; }
.subtitle { color: rgba(255,255,255,0.35); font-size: 0.88rem; margin: 0; }

/* ── Card ── */
.card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 2.5rem;
}

.card-title { font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 1.5rem; }

/* ── Form ── */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.field { display: flex; flex-direction: column; gap: 0.4rem; }

.field label {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

.field input {
  padding: 0.6rem 0.85rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9px;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.field input::placeholder { color: rgba(255,255,255,0.2); }
.field input:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }

/* ── Form buttons ── */
.form-actions { display: flex; gap: 0.75rem; }

.btn {
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 9px;
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn-create { background: #f59e0b; color: #0f0f1a; }
.btn-create:hover { background: #fbbf24; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(245,158,11,0.3); }
.btn-save { background: rgba(59,130,246,0.8); color: #fff; }
.btn-save:hover { background: #3b82f6; transform: translateY(-1px); }
.btn-cancel { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.1); }
.btn-cancel:hover { background: rgba(255,255,255,0.11); color: #fff; }

/* ── Section title ── */
.section-title { font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 1rem; }

/* ── Table ── */
.table-wrapper {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255,255,255,0.03);
  font-size: 0.875rem;
}

.table th {
  background: rgba(245,158,11,0.07);
  color: rgba(245,158,11,0.75);
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  white-space: nowrap;
}

.table td {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.7);
}
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover td { background: rgba(255,255,255,0.03); color: #fff; }

.id-badge {
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.35);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.patente {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: #f59e0b;
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.15);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  letter-spacing: 1px;
}

.muted { color: rgba(255,255,255,0.38); font-size: 0.85rem; }

.actions-cell { white-space: nowrap; }

.btn-action {
  border: none;
  padding: 0.3rem 0.7rem;
  border-radius: 7px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.2s, transform 0.15s;
}
.btn-action:hover { opacity: 0.85; transform: translateY(-1px); }
.btn-edit { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); margin-right: 5px; }
.btn-delete { background: rgba(239,68,68,0.1); color: #fca5a5; border: 1px solid rgba(239,68,68,0.22); }

.empty-row {
  text-align: center;
  color: rgba(255,255,255,0.25);
  padding: 2.5rem !important;
  font-size: 0.9rem;
}

/* ── Road strip ── */
.road-strip {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 48px;
  background: #1a1a2e;
  border-top: 2px solid #2a2a45;
  overflow: hidden;
}
.dashes {
  position: absolute;
  top: 50%; left: -120px; right: 0;
  height: 4px; margin-top: -2px;
  background: repeating-linear-gradient(
    to right, #f59e0b 0px, #f59e0b 40px, transparent 40px, transparent 80px
  );
  animation: drive 1.4s linear infinite;
}
@keyframes drive {
  from { transform: translateX(0); }
  to   { transform: translateX(80px); }
}

@media (prefers-reduced-motion: reduce) {
  .dashes { animation: none; }
}

@media (max-width: 768px) {
  .navbar { padding: 0 1rem; }
  .nav-links button { padding: 0.35rem 0.6rem; font-size: 0.75rem; }
  .form-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 480px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-actions { flex-wrap: wrap; }
}
</style>