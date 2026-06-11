<script setup>
definePageMeta({
  middleware: 'auth'
})
import { ref, onMounted } from 'vue'
import { API_URL } from '../composables/api'

const reservas   = ref([])
const vehiculos  = ref([])

const vehiculo_id    = ref('')
const cliente_nombre = ref('')
const fecha_inicio   = ref('')
const fecha_fin      = ref('')
const estado         = ref('pendiente')
const km_entrega     = ref('')
const km_devolucion  = ref('')
const editandoId     = ref(null)

// ── rq-05 / rq-06: mensajes visibles al usuario ───────────────────────────────
const errorMensaje = ref('')
const exitoMensaje = ref('')

const limpiarMensajes = () => {
  errorMensaje.value = ''
  exitoMensaje.value = ''
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

// Devuelve "Marca Modelo" dado un vehiculo_id
const getNombreVehiculo = (id) => {
  const v = vehiculos.value.find(v => v.id === id)
  return v ? `${v.marca} ${v.modelo}` : id
}

const crearReserva = async () => {
  limpiarMensajes()

  const response = await fetch(`${API_URL}/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`
    },
    body: JSON.stringify({
      vehiculo_id:    Number(vehiculo_id.value),
      cliente_nombre: cliente_nombre.value,
      fecha_inicio:   fecha_inicio.value,
      fecha_fin:      fecha_fin.value,
      estado:         estado.value,
      km_entrega:     km_entrega.value    !== '' ? Number(km_entrega.value)    : null,
      km_devolucion:  km_devolucion.value !== '' ? Number(km_devolucion.value) : null
    })
  })

  // ── rq-05 / rq-06: capturar 409 / 422 y mostrar mensaje claro
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
  editandoId.value     = reserva.id
  vehiculo_id.value    = reserva.vehiculo_id
  cliente_nombre.value = reserva.cliente_nombre
  fecha_inicio.value   = reserva.fecha_inicio
  fecha_fin.value      = reserva.fecha_fin
  estado.value         = reserva.estado
  km_entrega.value     = reserva.km_entrega    ?? ''
  km_devolucion.value  = reserva.km_devolucion ?? ''
}

const actualizarReserva = async () => {
  limpiarMensajes()

  const response = await fetch(`${API_URL}/reservas/${editandoId.value}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`
    },
    body: JSON.stringify({
      vehiculo_id:    Number(vehiculo_id.value),
      cliente_nombre: cliente_nombre.value,
      fecha_inicio:   fecha_inicio.value,
      fecha_fin:      fecha_fin.value,
      estado:         estado.value,
      km_entrega:     km_entrega.value    !== '' ? Number(km_entrega.value)    : null,
      km_devolucion:  km_devolucion.value !== '' ? Number(km_devolucion.value) : null
    })
  })

  // ── rq-05 / rq-06: capturar 409 / 422 y mostrar mensaje claro
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
  cargarVehiculos()
  cargarReservas()
})
</script>

<template>
  <div>

    <h1>Gestión de Reservas</h1>

    <button @click="navigateTo('/vehiculos')">Vehículos</button>
    <button @click="navigateTo('/reservas')">Reservas</button>
    <button @click="navigateTo('/disponibilidad')">Disponibilidad</button>
    <button @click="logout">Cerrar sesión</button>

    <hr>

    <h2>{{ editandoId ? 'Editar Reserva' : 'Nueva Reserva' }}</h2>

    <!-- ── rq-05 / rq-06: Banner de error (409 / 422) ───────────────────── -->
    <div v-if="errorMensaje" style="
        background:#fde8e8;
        border:1px solid #f87171;
        color:#b91c1c;
        padding:10px 14px;
        border-radius:6px;
        margin-bottom:12px;">
      ⚠️ {{ errorMensaje }}
    </div>

    <!-- ── Banner de éxito ──────────────────────────────────────────────── -->
    <div v-if="exitoMensaje" style="
        background:#d1fae5;
        border:1px solid #34d399;
        color:#065f46;
        padding:10px 14px;
        border-radius:6px;
        margin-bottom:12px;">
      ✅ {{ exitoMensaje }}
    </div>

    <select v-model="vehiculo_id">
      <option value="">Seleccione vehículo</option>
      <option v-for="vehiculo in vehiculos" :key="vehiculo.id" :value="vehiculo.id">
        {{ vehiculo.marca }} {{ vehiculo.modelo }}
      </option>
    </select>

    <br><br>

    <input v-model="cliente_nombre" placeholder="Nombre Cliente">

    <br><br>

    <label>Fecha inicio:</label>
    <input v-model="fecha_inicio" type="date">

    <br><br>

    <label>Fecha fin:</label>
    <input v-model="fecha_fin" type="date">

    <br><br>

    <select v-model="estado">
      <option value="pendiente">Pendiente</option>
      <option value="confirmada">Confirmada</option>
      <option value="cancelada">Cancelada</option>
    </select>

    <br><br>

    <!-- ── rq-06: campos de kilometraje ─────────────────────────────────── -->
    <label>Km al entregar:</label>
    <input v-model="km_entrega" type="number" min="0" placeholder="Ej: 50000">

    <br><br>

    <label>Km al devolver:</label>
    <input v-model="km_devolucion" type="number" min="0" placeholder="Ej: 50800">

    <br><br>

    <button v-if="!editandoId" @click="crearReserva">Crear Reserva</button>
    <button v-else @click="actualizarReserva">Actualizar Reserva</button>
    <button v-if="editandoId" @click="limpiarFormulario">Cancelar</button>

    <hr>

    <h2>Listado de Reservas</h2>

    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Vehículo</th>
          <th>Cliente</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th>Estado</th>
          <th>Km Entrega</th>
          <th>Km Devolución</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reserva in reservas" :key="reserva.id">
          <td>{{ reserva.id }}</td>
          <td>{{ getNombreVehiculo(reserva.vehiculo_id) }}</td>
          <td>{{ reserva.cliente_nombre }}</td>
          <td>{{ reserva.fecha_inicio }}</td>
          <td>{{ reserva.fecha_fin }}</td>
          <td>{{ reserva.estado }}</td>
          <td>{{ reserva.km_entrega ?? '—' }}</td>
          <td>{{ reserva.km_devolucion ?? '—' }}</td>
          <td>
            <button @click="editarReserva(reserva)">Editar</button>
            <button @click="eliminarReserva(reserva.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>