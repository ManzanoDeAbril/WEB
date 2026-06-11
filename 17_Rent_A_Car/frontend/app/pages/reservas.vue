<template>
  <div style="font-family: Arial, sans-serif; max-width: 960px; margin: 0 auto; padding: 20px;">

    <!-- ── Navegación ──────────────────────────────────────────────────────── -->
    <nav style="display:flex; gap:10px; margin-bottom:20px; padding:10px;
                background:#1a1a2e; border-radius:8px; flex-wrap:wrap;">
      <button @click="navigateTo('/panel')"
              style="background:#16213e; color:#e2e2e2; border:1px solid #0f3460;
                     padding:8px 14px; border-radius:5px; cursor:pointer;">
        🏠 Panel
      </button>
      <button @click="navigateTo('/vehiculos')"
              style="background:#16213e; color:#e2e2e2; border:1px solid #0f3460;
                     padding:8px 14px; border-radius:5px; cursor:pointer;">
        🚗 Vehículos
      </button>
      <button style="background:#0f3460; color:#fff; border:1px solid #e94560;
                     padding:8px 14px; border-radius:5px; cursor:pointer;">
        📋 Reservas
      </button>
      <button @click="navigateTo('/disponibilidad')"
              style="background:#16213e; color:#e2e2e2; border:1px solid #0f3460;
                     padding:8px 14px; border-radius:5px; cursor:pointer;">
        🔍 Disponibilidad
      </button>
      <button @click="logout"
              style="margin-left:auto; background:#c0392b; color:#fff; border:none;
                     padding:8px 14px; border-radius:5px; cursor:pointer;">
        Cerrar sesión
      </button>
    </nav>

    <h1>📋 Gestión de Reservas</h1>

    <!-- ── rq-05 / rq-06: banners de error / éxito ────────────────────────── -->
    <div v-if="errorMensaje"
         style="background:#fdecea; color:#c0392b; border:1px solid #e74c3c;
                border-radius:6px; padding:12px 16px; margin-bottom:14px;">
      ⚠️ {{ errorMensaje }}
    </div>
    <div v-if="exitoMensaje"
         style="background:#eafaf1; color:#1e8449; border:1px solid #27ae60;
                border-radius:6px; padding:12px 16px; margin-bottom:14px;">
      ✅ {{ exitoMensaje }}
    </div>

    <!-- ── rq-09: Formulario — Reserva por Rango de Fechas ────────────────── -->
    <div style="background:#f8f9fa; border:1px solid #dee2e6; border-radius:8px;
                padding:20px; margin-bottom:24px;">
      <h2 style="margin-top:0;">
        {{ editandoId ? '✏️ Editar Reserva' : '🗓️ Nueva Reserva por Rango de Fechas' }}
      </h2>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">

        <!-- Vehículo -->
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:4px;">Vehículo *</label>
          <select v-model="vehiculo_id"
                  style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px;">
            <option value="">-- Selecciona un vehículo --</option>
            <option v-for="v in vehiculos" :key="v.id" :value="v.id">
              {{ v.marca }} {{ v.modelo }} ({{ v.patente }})
            </option>
          </select>
        </div>

        <!-- Cliente -->
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:4px;">Nombre del cliente *</label>
          <input v-model="cliente_nombre" type="text" placeholder="Ej: Juan Pérez"
                 style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
        </div>

        <!-- Fecha inicio -->
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:4px;">📅 Fecha de inicio *</label>
          <input v-model="fecha_inicio" type="date"
                 style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
        </div>

        <!-- Fecha fin -->
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:4px;">📅 Fecha de fin *</label>
          <input v-model="fecha_fin" type="date"
                 style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
        </div>

        <!-- Duración calculada — evidencia del rango de fechas -->
        <div v-if="diasReserva !== null" style="grid-column: span 2;">
          <div style="background:#e8f4fd; border:1px solid #3498db; border-radius:5px;
                      padding:10px 14px; color:#1a5276; font-weight:bold;">
            ⏱️ Duración del alquiler: <strong>{{ diasReserva }} día{{ diasReserva !== 1 ? 's' : '' }}</strong>
          </div>
        </div>

        <!-- Estado -->
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:4px;">Estado</label>
          <select v-model="estado"
                  style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px;">
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <!-- Km entrega -->
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:4px;">Km al entregar</label>
          <input v-model="km_entrega" type="number" min="0" placeholder="Ej: 50000"
                 style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
        </div>

        <!-- Km devolución -->
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:4px;">Km al devolver</label>
          <input v-model="km_devolucion" type="number" min="0" placeholder="Ej: 50800"
                 style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
        </div>

      </div>

      <!-- Botones -->
      <div style="margin-top:16px; display:flex; gap:10px;">
        <button v-if="!editandoId" @click="crearReserva"
                style="background:#27ae60; color:#fff; border:none; padding:10px 20px;
                       border-radius:5px; cursor:pointer; font-size:14px;">
          ✚ Crear Reserva
        </button>
        <button v-else @click="actualizarReserva"
                style="background:#2980b9; color:#fff; border:none; padding:10px 20px;
                       border-radius:5px; cursor:pointer; font-size:14px;">
          💾 Guardar Cambios
        </button>
        <button v-if="editandoId" @click="limpiarFormulario"
                style="background:#7f8c8d; color:#fff; border:none; padding:10px 20px;
                       border-radius:5px; cursor:pointer; font-size:14px;">
          ✖ Cancelar
        </button>
      </div>
    </div>

    <!-- ── Listado de Reservas ─────────────────────────────────────────────── -->
    <h2>📄 Listado de Reservas</h2>
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead>
          <tr style="background:#1a1a2e; color:#fff;">
            <th style="padding:10px 12px; text-align:left;">ID</th>
            <th style="padding:10px 12px; text-align:left;">Vehículo</th>
            <th style="padding:10px 12px; text-align:left;">Cliente</th>
            <th style="padding:10px 12px; text-align:left;">Inicio</th>
            <th style="padding:10px 12px; text-align:left;">Fin</th>
            <th style="padding:10px 12px; text-align:left;">Días</th>
            <th style="padding:10px 12px; text-align:left;">Estado</th>
            <th style="padding:10px 12px; text-align:left;">Km Entrega</th>
            <th style="padding:10px 12px; text-align:left;">Km Devolución</th>
            <th style="padding:10px 12px; text-align:left;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reserva, i) in reservas" :key="reserva.id"
              :style="{ background: i % 2 === 0 ? '#ffffff' : '#f2f2f2' }">
            <td style="padding:8px 12px;">{{ reserva.id }}</td>
            <td style="padding:8px 12px;">{{ getNombreVehiculo(reserva.vehiculo_id) }}</td>
            <td style="padding:8px 12px;">{{ reserva.cliente_nombre }}</td>
            <td style="padding:8px 12px;">{{ reserva.fecha_inicio }}</td>
            <td style="padding:8px 12px;">{{ reserva.fecha_fin }}</td>
            <td style="padding:8px 12px;">{{ calcularDias(reserva.fecha_inicio, reserva.fecha_fin) }}</td>
            <td style="padding:8px 12px;">
              <span :style="badgeEstado(reserva.estado)">{{ reserva.estado }}</span>
            </td>
            <td style="padding:8px 12px;">{{ reserva.km_entrega ?? '—' }}</td>
            <td style="padding:8px 12px;">{{ reserva.km_devolucion ?? '—' }}</td>
            <td style="padding:8px 12px; white-space:nowrap;">
              <button @click="editarReserva(reserva)"
                      style="background:#f39c12; color:#fff; border:none; padding:5px 10px;
                             border-radius:4px; cursor:pointer; margin-right:5px;">
                ✏️ Editar
              </button>
              <button @click="eliminarReserva(reserva.id)"
                      style="background:#e74c3c; color:#fff; border:none; padding:5px 10px;
                             border-radius:4px; cursor:pointer;">
                🗑️ Eliminar
              </button>
            </td>
          </tr>
          <tr v-if="reservas.length === 0">
            <td colspan="10" style="padding:20px; text-align:center; color:#888;">
              No hay reservas registradas.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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

// ── rq-05 / rq-06: mensajes ──────────────────────────────────────────────────
const errorMensaje = ref('')
const exitoMensaje = ref('')
const limpiarMensajes = () => { errorMensaje.value = ''; exitoMensaje.value = '' }

// ── rq-09: duración calculada en tiempo real ─────────────────────────────────
const diasReserva = computed(() => {
  if (!fecha_inicio.value || !fecha_fin.value) return null
  const inicio = new Date(fecha_inicio.value)
  const fin    = new Date(fecha_fin.value)
  const diff   = Math.round((fin - inicio) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? diff + 1 : null   // inclusivo: mismo día = 1 día
})

const calcularDias = (ini, fin) => {
  if (!ini || !fin) return '—'
  const diff = Math.round((new Date(fin) - new Date(ini)) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? `${diff + 1}d` : '—'
}

const badgeEstado = (estado) => {
  const map = {
    pendiente:  'background:#fff3cd; color:#856404; padding:2px 8px; border-radius:12px; font-size:12px;',
    confirmada: 'background:#d1e7dd; color:#0f5132; padding:2px 8px; border-radius:12px; font-size:12px;',
    cancelada:  'background:#f8d7da; color:#842029; padding:2px 8px; border-radius:12px; font-size:12px;',
  }
  return map[estado] ?? ''
}

// ── Token ─────────────────────────────────────────────────────────────────────
const token = () => localStorage.getItem('token')

// ── Carga de datos ────────────────────────────────────────────────────────────
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

// ── CRUD ──────────────────────────────────────────────────────────────────────
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