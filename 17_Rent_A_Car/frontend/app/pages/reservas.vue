<template>
  <div class="page">

    <!-- ── Navbar ── -->
    <nav class="navbar">
      <span class="brand">🚗 Rent<span class="brand-accent">A</span>Car</span>
      <div class="nav-links">
        <button @click="navigateTo('/panel')">Panel</button>
        <button @click="navigateTo('/vehiculos')">Vehículos</button>
        <button class="active">Reservas</button>
        <button @click="navigateTo('/disponibilidad')">Disponibilidad</button>
        <button @click="navigateTo('/rq-10')" class="nav-btn">
          ⚙️ Extras & Multas
        </button>
        <button class="logout" @click="logout">Cerrar sesión</button>

      </div>
    </nav>

    <main class="container">
      <div class="page-header">
        <h1>Gestión de Reservas</h1>
        <p class="subtitle">Creá, editá y eliminá reservas de vehículos.</p>
      </div>

      <!-- ── Banners ── -->
      <div v-if="errorMensaje" class="banner banner-error">⚠️ {{ errorMensaje }}</div>
      <div v-if="exitoMensaje" class="banner banner-success">✅ {{ exitoMensaje }}</div>

      <!-- ── Formulario ── -->
      <div class="card form-card">
        <h2 class="card-title">
          {{ editandoId ? '✏️ Editar Reserva' : '🗓️ Nueva Reserva' }}
        </h2>

        <div class="form-grid">

          <div class="field">
            <label>Vehículo <span class="required">*</span></label>
            <select v-model="vehiculo_id">
              <option value="">— Selecciona un vehículo —</option>
              <option v-for="v in vehiculos" :key="v.id" :value="v.id">
                {{ v.marca }} {{ v.modelo }} ({{ v.patente }})
              </option>
            </select>
          </div>

          <div class="field">
            <label>Nombre del cliente <span class="required">*</span></label>
            <input v-model="cliente_nombre" type="text" placeholder="Ej: Juan Pérez" />
          </div>

          <div class="field">
            <label>Fecha de inicio <span class="required">*</span></label>
            <input v-model="fecha_inicio" type="date" />
          </div>

          <div class="field">
            <label>Fecha de fin <span class="required">*</span></label>
            <input v-model="fecha_fin" type="date" />
          </div>

          <div v-if="diasReserva !== null" class="field span-2">
            <div class="duration-badge">
              ⏱️ Duración del alquiler:
              <strong>{{ diasReserva }} día{{ diasReserva !== 1 ? 's' : '' }}</strong>
            </div>
          </div>

          <div class="field">
            <label>Estado</label>
            <select v-model="estado">
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div class="field">
            <label>Km al entregar</label>
            <input v-model="km_entrega" type="number" min="0" placeholder="Ej: 50 000" />
          </div>

          <div class="field">
            <label>Km al devolver</label>
            <input v-model="km_devolucion" type="number" min="0" placeholder="Ej: 50 800" />
          </div>

        </div>

        <div class="form-actions">
          <button v-if="!editandoId" class="btn btn-create" @click="crearReserva">
            ✚ Crear Reserva
          </button>
          <button v-else class="btn btn-save" @click="actualizarReserva">
            💾 Guardar Cambios
          </button>
          <button v-if="editandoId" class="btn btn-cancel" @click="limpiarFormulario">
            ✖ Cancelar
          </button>
        </div>
      </div>

      <!-- ── Listado ── -->
      <h2 class="section-title">Listado de Reservas</h2>

      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Vehículo</th>
              <th>Cliente</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Días</th>
              <th>Estado</th>
              <th>Km Entrega</th>
              <th>Km Dev.</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reserva in reservas" :key="reserva.id">
              <td><span class="id-badge">{{ reserva.id }}</span></td>
              <td><strong>{{ getNombreVehiculo(reserva.vehiculo_id) }}</strong></td>
              <td>{{ reserva.cliente_nombre }}</td>
              <td class="date">{{ reserva.fecha_inicio }}</td>
              <td class="date">{{ reserva.fecha_fin }}</td>
              <td class="muted">{{ calcularDias(reserva.fecha_inicio, reserva.fecha_fin) }}</td>
              <td>
                <span :class="['estado-badge', `estado-${reserva.estado}`]">
                  {{ reserva.estado }}
                </span>
              </td>
              <td class="muted">{{ reserva.km_entrega ?? '—' }}</td>
              <td class="muted">{{ reserva.km_devolucion ?? '—' }}</td>
              <td class="actions-cell">
                <button class="btn-action btn-edit" @click="editarReserva(reserva)">✏️ Editar</button>
                <button class="btn-action btn-delete" @click="eliminarReserva(reserva.id)">🗑️ Eliminar</button>
              </td>
            </tr>
            <tr v-if="reservas.length === 0">
              <td colspan="10" class="empty-row">No hay reservas registradas.</td>
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

import { ref, computed, onMounted } from 'vue'
import { API_URL } from '../composables/api'

const reservas    = ref([])
const vehiculos   = ref([])

const vehiculo_id     = ref('')
const cliente_nombre  = ref('')
const fecha_inicio    = ref('')
const fecha_fin       = ref('')
const estado          = ref('pendiente')
const km_entrega      = ref('')
const km_devolucion   = ref('')
const editandoId      = ref(null)

const errorMensaje = ref('')
const exitoMensaje = ref('')
const limpiarMensajes = () => { errorMensaje.value = ''; exitoMensaje.value = '' }

const diasReserva = computed(() => {
  if (!fecha_inicio.value || !fecha_fin.value) return null
  const inicio = new Date(fecha_inicio.value)
  const fin    = new Date(fecha_fin.value)
  const diff   = Math.round((fin - inicio) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? diff + 1 : null
})

const calcularDias = (ini, fin) => {
  if (!ini || !fin) return '—'
  const diff = Math.round((new Date(fin) - new Date(ini)) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? `${diff + 1}d` : '—'
}

const token = () => localStorage.getItem('token')

const cargarReservas = async () => {
  const response = await fetch(`${API_URL}/reservas`, {
    headers: { Authorization: `Bearer ${token()}` }
  })
  reservas.value = await response.json()
}

const cargarVehiculos = async () => {
  const response = await fetch(`${API_URL}/vehiculos`, {
    headers: { Authorization: `Bearer ${token()}` }
  })
  vehiculos.value = await response.json()
}

const getNombreVehiculo = (id) => {
  const v = vehiculos.value.find(v => v.id === id)
  return v ? `${v.marca} ${v.modelo}` : id
}

const crearReserva = async () => {
  limpiarMensajes()
  const response = await fetch(`${API_URL}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: JSON.stringify({
      vehiculo_id:    Number(vehiculo_id.value),
      cliente_nombre: cliente_nombre.value,
      fecha_inicio:   fecha_inicio.value,
      fecha_fin:      fecha_fin.value,
      estado:         estado.value,
      km_entrega:     km_entrega.value     !== '' ? Number(km_entrega.value)     : null,
      km_devolucion:  km_devolucion.value  !== '' ? Number(km_devolucion.value)  : null
    })
  })
  if (!response.ok) {
    const data = await response.json()
    errorMensaje.value = data.message || 'Error al crear la reserva.'
    return
  }
  exitoMensaje.value = 'Reserva creada correctamente.'
  limpiarFormulario()
  cargarReservas()
}

const editarReserva = (reserva) => {
  limpiarMensajes()
  editandoId.value      = reserva.id
  vehiculo_id.value     = reserva.vehiculo_id
  cliente_nombre.value  = reserva.cliente_nombre
  fecha_inicio.value    = reserva.fecha_inicio
  fecha_fin.value       = reserva.fecha_fin
  estado.value          = reserva.estado
  km_entrega.value      = reserva.km_entrega    ?? ''
  km_devolucion.value   = reserva.km_devolucion ?? ''
}

const actualizarReserva = async () => {
  limpiarMensajes()
  const response = await fetch(`${API_URL}/reservas/${editandoId.value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: JSON.stringify({
      vehiculo_id:    Number(vehiculo_id.value),
      cliente_nombre: cliente_nombre.value,
      fecha_inicio:   fecha_inicio.value,
      fecha_fin:      fecha_fin.value,
      estado:         estado.value,
      km_entrega:     km_entrega.value     !== '' ? Number(km_entrega.value)     : null,
      km_devolucion:  km_devolucion.value  !== '' ? Number(km_devolucion.value)  : null
    })
  })
  if (!response.ok) {
    const data = await response.json()
    errorMensaje.value = data.message || 'Error al actualizar la reserva.'
    return
  }
  exitoMensaje.value = 'Reserva actualizada correctamente.'
  limpiarFormulario()
  cargarReservas()
}

const eliminarReserva = async (id) => {
  limpiarMensajes()
  await fetch(`${API_URL}/reservas/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token()}` }
  })
  cargarReservas()
}

const limpiarFormulario = () => {
  editandoId.value     = null
  vehiculo_id.value    = ''
  cliente_nombre.value = ''
  fecha_inicio.value   = ''
  fecha_fin.value      = ''
  estado.value         = 'pendiente'
  km_entrega.value     = ''
  km_devolucion.value  = ''
}

const logout = () => {
  localStorage.removeItem('token')
  navigateTo('/login')
}

onMounted(() => {
  cargarReservas()
  cargarVehiculos()
})
</script>

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

.brand {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
}
.brand-accent { color: #f59e0b; }

.nav-links { display: flex; gap: 0.4rem; }

.nav-links button {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.5);
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.83rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.nav-links button:hover { background: rgba(255,255,255,0.08); color: #fff; }
.nav-links button.active {
  background: rgba(245,158,11,0.12);
  border-color: rgba(245,158,11,0.4);
  color: #f59e0b;
}
.nav-links .logout {
  border-color: rgba(239,68,68,0.3);
  color: rgba(239,68,68,0.7);
}
.nav-links .logout:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }

/* ── Container ── */
.container { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }

.page-header { margin-bottom: 1.75rem; }
.page-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.3rem;
  letter-spacing: -0.5px;
}
.subtitle { color: rgba(255,255,255,0.35); font-size: 0.88rem; margin: 0; }

/* ── Banners ── */
.banner {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.88rem;
  margin-bottom: 1rem;
  border: 1px solid;
}
.banner-error {
  background: rgba(239,68,68,0.1);
  color: #fca5a5;
  border-color: rgba(239,68,68,0.25);
}
.banner-success {
  background: rgba(34,197,94,0.1);
  color: #86efac;
  border-color: rgba(34,197,94,0.25);
}

/* ── Card ── */
.card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 2.5rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1.5rem;
}

/* ── Form ── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;
}

.span-2 { grid-column: span 2; }

.field { display: flex; flex-direction: column; gap: 0.4rem; }

.field label {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

.required { color: #f59e0b; }

.field input,
.field select {
  padding: 0.6rem 0.85rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9px;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  color-scheme: dark;
}

.field input::placeholder { color: rgba(255,255,255,0.2); }

.field input:focus,
.field select:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
}

.field select option { background: #1a1a2e; color: #e2e8f0; }

.duration-badge {
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 9px;
  padding: 0.65rem 1rem;
  color: rgba(245,158,11,0.9);
  font-size: 0.88rem;
}

.duration-badge strong { color: #f59e0b; }

/* ── Form buttons ── */
.form-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }

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

.btn-create {
  background: #f59e0b;
  color: #0f0f1a;
}
.btn-create:hover { background: #fbbf24; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(245,158,11,0.3); }

.btn-save {
  background: rgba(59,130,246,0.8);
  color: #fff;
}
.btn-save:hover { background: #3b82f6; transform: translateY(-1px); }

.btn-cancel {
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.5);
  border: 1px solid rgba(255,255,255,0.1);
}
.btn-cancel:hover { background: rgba(255,255,255,0.11); color: #fff; }

/* ── Section title ── */
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1rem;
}

/* ── Table ── */
.table-wrapper {
  border-radius: 14px;
  overflow-x: auto;
  border: 1px solid rgba(255,255,255,0.08);
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

.date { color: rgba(255,255,255,0.5); font-size: 0.82rem; }
.muted { color: rgba(255,255,255,0.35); font-size: 0.82rem; }

/* ── Estado badges ── */
.estado-badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.3px;
}
.estado-pendiente {
  background: rgba(234,179,8,0.12);
  color: #fde047;
  border: 1px solid rgba(234,179,8,0.25);
}
.estado-confirmada {
  background: rgba(34,197,94,0.1);
  color: #86efac;
  border: 1px solid rgba(34,197,94,0.22);
}
.estado-cancelada {
  background: rgba(239,68,68,0.1);
  color: #fca5a5;
  border: 1px solid rgba(239,68,68,0.22);
}

/* ── Action buttons ── */
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

.btn-edit {
  background: rgba(245,158,11,0.15);
  color: #f59e0b;
  border: 1px solid rgba(245,158,11,0.25);
  margin-right: 5px;
}
.btn-delete {
  background: rgba(239,68,68,0.1);
  color: #fca5a5;
  border: 1px solid rgba(239,68,68,0.22);
}

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
  height: 4px;
  margin-top: -2px;
  background: repeating-linear-gradient(
    to right,
    #f59e0b 0px, #f59e0b 40px,
    transparent 40px, transparent 80px
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

@media (max-width: 640px) {
  .navbar { padding: 0 1rem; }
  .nav-links button { padding: 0.35rem 0.6rem; font-size: 0.75rem; }
  .form-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: span 1; }
}
</style>