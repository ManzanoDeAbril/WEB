<script setup>
definePageMeta({
  middleware: 'auth'
})
import { ref, onMounted } from 'vue'
import { API_URL } from '../composables/api'

const reservas = ref([])
const vehiculos = ref([])

const vehiculo_id = ref('')
const cliente_nombre = ref('')
const fecha_inicio = ref('')
const fecha_fin = ref('')
const estado = ref('pendiente')

const editandoId = ref(null)

const token = () => localStorage.getItem('token')

const cargarReservas = async () => {

  const response = await fetch(`${API_URL}/reservas`, {
    headers: {
      Authorization: `Bearer ${token()}`
    }
  })

  reservas.value = await response.json()
}

const cargarVehiculos = async () => {

  const response = await fetch(`${API_URL}/vehiculos`, {
    headers: {
      Authorization: `Bearer ${token()}`
    }
  })

  vehiculos.value = await response.json()
}

const crearReserva = async () => {

  const response = await fetch(`${API_URL}/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`
    },
    body: JSON.stringify({
      vehiculo_id: Number(vehiculo_id.value),
      cliente_nombre: cliente_nombre.value,
      fecha_inicio: fecha_inicio.value,
      fecha_fin: fecha_fin.value,
      estado: estado.value
    })
  })

  if (response.ok) {
    limpiarFormulario()
    cargarReservas()
  }
}

const editarReserva = (reserva) => {

  editandoId.value = reserva.id

  vehiculo_id.value = reserva.vehiculo_id
  cliente_nombre.value = reserva.cliente_nombre
  fecha_inicio.value = reserva.fecha_inicio
  fecha_fin.value = reserva.fecha_fin
  estado.value = reserva.estado
}

const actualizarReserva = async () => {

  const response = await fetch(
    `${API_URL}/reservas/${editandoId.value}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify({
        vehiculo_id: Number(vehiculo_id.value),
        cliente_nombre: cliente_nombre.value,
        fecha_inicio: fecha_inicio.value,
        fecha_fin: fecha_fin.value,
        estado: estado.value
      })
    }
  )

  if (response.ok) {
    limpiarFormulario()
    cargarReservas()
  }
}

const eliminarReserva = async (id) => {

  await fetch(`${API_URL}/reservas/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token()}`
    }
  })

  cargarReservas()
}

const limpiarFormulario = () => {

  editandoId.value = null

  vehiculo_id.value = ''
  cliente_nombre.value = ''
  fecha_inicio.value = ''
  fecha_fin.value = ''
  estado.value = 'pendiente'
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

    <button @click="navigateTo('/vehiculos')">
      Vehículos
    </button>

    <button @click="navigateTo('/reservas')">
     Reservas
    </button>

    <button @click="logout">
      Cerrar sesión
    </button>

    <hr>

    <h2>
      {{ editandoId ? 'Editar Reserva' : 'Nueva Reserva' }}
    </h2>

    <select v-model="vehiculo_id">

      <option value="">
        Seleccione vehículo
      </option>

      <option
        v-for="vehiculo in vehiculos"
        :key="vehiculo.id"
        :value="vehiculo.id"
      >
        {{ vehiculo.marca }} {{ vehiculo.modelo }}
      </option>

    </select>

    <br><br>

    <input
      v-model="cliente_nombre"
      placeholder="Nombre Cliente"
    >

    <br><br>

    <input
      v-model="fecha_inicio"
      type="date"
    >

    <br><br>

    <input
      v-model="fecha_fin"
      type="date"
    >

    <br><br>

    <select v-model="estado">

      <option value="pendiente">
        Pendiente
      </option>

      <option value="confirmada">
        Confirmada
      </option>

      <option value="cancelada">
        Cancelada
      </option>

    </select>

    <br><br>

    <button
      v-if="!editandoId"
      @click="crearReserva"
    >
      Crear Reserva
    </button>

    <button
      v-else
      @click="actualizarReserva"
    >
      Actualizar Reserva
    </button>

    <button
      v-if="editandoId"
      @click="limpiarFormulario"
    >
      Cancelar
    </button>

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
          <th>Acciones</th>
        </tr>

      </thead>

      <tbody>

        <tr
          v-for="reserva in reservas"
          :key="reserva.id"
        >

          <td>{{ reserva.id }}</td>

          <td>{{ reserva.vehiculo_id }}</td>

          <td>{{ reserva.cliente_nombre }}</td>

          <td>{{ reserva.fecha_inicio }}</td>

          <td>{{ reserva.fecha_fin }}</td>

          <td>{{ reserva.estado }}</td>

          <td>

            <button
              @click="editarReserva(reserva)"
            >
              Editar
            </button>

            <button
              @click="eliminarReserva(reserva.id)"
            >
              Eliminar
            </button>

          </td>

        </tr>

      </tbody>

    </table>

  </div>

</template>