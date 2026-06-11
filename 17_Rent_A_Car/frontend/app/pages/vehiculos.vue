<script setup>
definePageMeta({
  middleware: 'auth'
})
import { ref, onMounted } from 'vue'
import { API_URL } from '../composables/api'

const vehiculos = ref([])

const marca = ref('')
const modelo = ref('')
const anio = ref('')
const patente = ref('')
const color = ref('')

const editandoId = ref(null)

const cargarVehiculos = async () => {

  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/vehiculos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  vehiculos.value = data

}

const crearVehiculo = async () => {

  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/vehiculos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      marca: marca.value,
      modelo: modelo.value,
      anio: anio.value,
      patente: patente.value,
      color: color.value,
      kilometraje: 0,
      disponible: true
    })
  })

  if (response.ok) {

    limpiarFormulario()

    cargarVehiculos()

  }

}

const editarVehiculo = (vehiculo) => {

  editandoId.value = vehiculo.id

  marca.value = vehiculo.marca
  modelo.value = vehiculo.modelo
  anio.value = vehiculo.anio
  patente.value = vehiculo.patente
  color.value = vehiculo.color

}

const actualizarVehiculo = async () => {

  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/vehiculos/${editandoId.value}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        marca: marca.value,
        modelo: modelo.value,
        anio: anio.value,
        patente: patente.value,
        color: color.value,
        kilometraje: 0,
        disponible: true
      })
    }
  )

  if (response.ok) {

    limpiarFormulario()

    cargarVehiculos()

  }

}

const eliminarVehiculo = async (id) => {

  const token = localStorage.getItem('token')

  await fetch(`${API_URL}/vehiculos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  cargarVehiculos()

}

const limpiarFormulario = () => {

  editandoId.value = null

  marca.value = ''
  modelo.value = ''
  anio.value = ''
  patente.value = ''
  color.value = ''

}

const logout = () => {

  localStorage.removeItem('token')

  navigateTo('/login')

}

onMounted(() => {
  cargarVehiculos()
})
</script>

<template>

  <div>

    <h1>Gestión de Vehículos</h1>

    <button @click="navigateTo('/vehiculos')">
    Vehículos
    </button>

    <button @click="navigateTo('/reservas')">
    Reservas
    </button>

    <button @click="navigateTo('/disponibilidad')">Disponibilidad</button>

    <button @click="logout">
      Cerrar sesión
    </button>

    <hr>

    <h2>
      {{ editandoId ? 'Editar Vehículo' : 'Nuevo Vehículo' }}
    </h2>

    <input
      v-model="marca"
      placeholder="Marca"
    >

    <br><br>

    <input
      v-model="modelo"
      placeholder="Modelo"
    >

    <br><br>

    <input
      v-model="anio"
      placeholder="Año"
    >

    <br><br>

    <input
      v-model="patente"
      placeholder="Patente"
    >

    <br><br>

    <input
      v-model="color"
      placeholder="Color"
    >

    <br><br>

    <button
      v-if="!editandoId"
      @click="crearVehiculo"
    >
      Crear Vehículo
    </button>

    <button
      v-else
      @click="actualizarVehiculo"
    >
      Actualizar Vehículo
    </button>

    <button
      v-if="editandoId"
      @click="limpiarFormulario"
    >
      Cancelar
    </button>

    <hr>

    <h2>Listado de Vehículos</h2>

    <table border="1" cellpadding="8">

      <thead>
        <tr>
          <th>ID</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Patente</th>
          <th>Color</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>

        <tr
          v-for="vehiculo in vehiculos"
          :key="vehiculo.id"
        >
          <td>{{ vehiculo.id }}</td>
          <td>{{ vehiculo.marca }}</td>
          <td>{{ vehiculo.modelo }}</td>
          <td>{{ vehiculo.anio }}</td>
          <td>{{ vehiculo.patente }}</td>
          <td>{{ vehiculo.color }}</td>

          <td>

            <button
              @click="editarVehiculo(vehiculo)"
            >
              Editar
            </button>

            <button
              @click="eliminarVehiculo(vehiculo.id)"
            >
              Eliminar
            </button>

          </td>

        </tr>

      </tbody>

    </table>

  </div>

</template>