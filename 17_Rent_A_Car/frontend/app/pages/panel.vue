<script setup>
definePageMeta({ middleware: 'auth' })
import { ref, onMounted } from 'vue'
import { API_URL } from '../composables/api'

const datos    = ref(null)
const cargando = ref(true)
const error    = ref('')

const token = () => localStorage.getItem('token')

const cargarPanel = async () => {
  cargando.value = true
  error.value    = ''
  try {
    const response = await fetch(`${API_URL}/panel`, {
      headers: { Authorization: `Bearer ${token()}` }
    })
    const data = await response.json()
    if (!response.ok) {
      error.value = data.error || 'Error al cargar el panel.'
    } else {
      datos.value = data
    }
  } catch (e) {
    error.value = 'No se pudo conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  navigateTo('/login')
}

onMounted(() => cargarPanel())
</script>

<template>
  <div>
    <h1>Panel Principal — Rent-a-Car</h1>

    <button @click="navigateTo('/panel')">Panel</button>
    <button @click="navigateTo('/vehiculos')">Vehículos</button>
    <button @click="navigateTo('/reservas')">Reservas</button>
    <button @click="navigateTo('/disponibilidad')">Disponibilidad</button>
    <button @click="logout">Cerrar sesión</button>

    <hr>

    <div v-if="cargando"><p>Cargando panel...</p></div>

    <div v-else-if="error" style="background:#fde8e8;border:1px solid #f87171;color:#b91c1c;padding:10px 14px;border-radius:6px;">
      ⚠️ {{ error }}
    </div>

    <div v-else-if="datos">

      <h2>🚗 Flota</h2>
      <table border="1" cellpadding="8">
        <thead>
          <tr><th>Total vehículos</th><th>Libres hoy</th><th>Ocupados hoy</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ datos.flota.total }}</td>
            <td>{{ datos.flota.libres }}</td>
            <td>{{ datos.flota.ocupados }}</td>
          </tr>
        </tbody>
      </table>

      <br>

      <h2>📋 Reservas</h2>
      <table border="1" cellpadding="8">
        <thead>
          <tr><th>Total</th><th>Pendientes</th><th>Confirmadas</th><th>Canceladas</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ datos.reservas.total }}</td>
            <td>{{ datos.reservas.pendientes }}</td>
            <td>{{ datos.reservas.confirmadas }}</td>
            <td>{{ datos.reservas.canceladas }}</td>
          </tr>
        </tbody>
      </table>

      <br>

      <h2>🕒 Últimas reservas</h2>

      <p v-if="datos.ultimasReservas.length === 0">No hay reservas registradas aún.</p>

      <table v-else border="1" cellpadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Vehículo</th><th>Cliente</th>
            <th>Fecha inicio</th><th>Fecha fin</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in datos.ultimasReservas" :key="r.id">
            <td>{{ r.id }}</td>
            <td>
              <span v-if="r.Vehiculo">{{ r.Vehiculo.marca }} {{ r.Vehiculo.modelo }} ({{ r.Vehiculo.patente }})</span>
              <span v-else>—</span>
            </td>
            <td>{{ r.cliente_nombre }}</td>
            <td>{{ r.fecha_inicio }}</td>
            <td>{{ r.fecha_fin }}</td>
            <td>{{ r.estado }}</td>
          </tr>
        </tbody>
      </table>

      <br>
      <button @click="cargarPanel">🔄 Actualizar</button>

    </div>
  </div>
</template>