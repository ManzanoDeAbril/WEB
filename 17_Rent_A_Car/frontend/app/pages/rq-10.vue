<template>
  <div class="page">

    <!-- ── Navbar ── -->
    <nav class="navbar">
      <span class="brand">🚗 Rent<span class="brand-accent">A</span>Car</span>
      <div class="nav-links">
        <button @click="navigateTo('/panel')">Panel</button>
        <button @click="navigateTo('/vehiculos')">Vehículos</button>
        <button @click="navigateTo('/reservas')">Reservas</button>
        <button @click="navigateTo('/disponibilidad')">Disponibilidad</button>
        <button class="active">Extras & Multas</button>
        <button class="logout" @click="logout">Cerrar sesión</button>
      </div>
    </nav>

    <main class="container">
      <div class="page-header">
        <h1>Extras y Multas</h1>
        <p class="subtitle">Administrá servicios adicionales, asignaciones y multas por atraso.</p>
      </div>

      <!-- Banners -->
      <div v-if="errorMsg" class="banner banner-error">⚠️ {{ errorMsg }}</div>
      <div v-if="okMsg"    class="banner banner-ok">✅ {{ okMsg }}</div>

      <!-- ══ SECCIÓN 1 — Catálogo de Extras ══ -->
      <section class="card">
        <h2 class="card-title">🎁 Catálogo de Extras</h2>
        <p class="card-sub">Define los servicios adicionales disponibles (GPS, silla infantil, seguro extra, etc.).</p>

        <div class="form-grid-4">
          <div class="field">
            <label>Nombre <span class="req">*</span></label>
            <input v-model="eNombre" type="text" placeholder="Ej: GPS" />
          </div>
          <div class="field">
            <label>Descripción</label>
            <input v-model="eDescripcion" type="text" placeholder="Descripción opcional" />
          </div>
          <div class="field">
            <label>Precio/día <span class="req">*</span></label>
            <input v-model="ePrecio" type="number" min="0" step="0.01" placeholder="0.00" />
          </div>
          <div class="field field-actions">
            <label>&nbsp;</label>
            <div class="btn-row">
              <button v-if="!eEditandoId" class="btn btn-create" @click="crearExtra">✚ Agregar</button>
              <template v-else>
                <button class="btn btn-save" @click="actualizarExtra">💾 Guardar</button>
                <button class="btn btn-cancel" @click="limpiarExtra">✖</button>
              </template>
            </div>
          </div>
        </div>

        <div class="table-wrapper mt">
          <table class="table">
            <thead>
              <tr>
                <th>#</th><th>Nombre</th><th>Descripción</th>
                <th class="right">Precio/día</th><th class="center">Activo</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ex in extras" :key="ex.id">
                <td><span class="id-badge">{{ ex.id }}</span></td>
                <td><strong>{{ ex.nombre }}</strong></td>
                <td class="muted">{{ ex.descripcion || '—' }}</td>
                <td class="right amber">$ {{ Number(ex.precio_por_dia).toFixed(2) }}</td>
                <td class="center">
                  <span :class="['pill', ex.activo ? 'pill-green' : 'pill-red']">
                    {{ ex.activo ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-action btn-edit" @click="editarExtra(ex)">✏️ Editar</button>
                  <button class="btn-action btn-delete" @click="eliminarExtra(ex.id)">🗑️</button>
                </td>
              </tr>
              <tr v-if="extras.length === 0">
                <td colspan="6" class="empty-row">No hay extras definidos aún.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ══ SECCIÓN 2 — Asignar Extras ══ -->
      <section class="card card-blue">
        <h2 class="card-title">📎 Asignar Extras a una Reserva</h2>

        <div class="form-grid-4">
          <div class="field">
            <label>Reserva <span class="req">*</span></label>
            <select v-model="asigReservaId" @change="cargarExtrasDeReserva">
              <option value="">— Selecciona una reserva —</option>
              <option v-for="r in reservas" :key="r.id" :value="r.id">
                #{{ r.id }} — {{ r.cliente_nombre }} ({{ r.fecha_inicio }} → {{ r.fecha_fin }})
              </option>
            </select>
          </div>
          <div class="field">
            <label>Extra <span class="req">*</span></label>
            <select v-model="asigExtraId">
              <option value="">— Selecciona un extra —</option>
              <option v-for="ex in extras.filter(e => e.activo)" :key="ex.id" :value="ex.id">
                {{ ex.nombre }} — ${{ Number(ex.precio_por_dia).toFixed(2) }}/día
              </option>
            </select>
          </div>
          <div class="field">
            <label>Cantidad</label>
            <input v-model="asigCantidad" type="number" min="1" />
          </div>
          <div class="field field-actions">
            <label>&nbsp;</label>
            <button class="btn btn-save" @click="agregarExtraAReserva">➕ Agregar</button>
          </div>
        </div>

        <div v-if="asigReservaId" class="mt">
          <p class="subsection-title">Extras en Reserva #{{ asigReservaId }}</p>
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Extra</th><th class="right">Precio/día</th>
                  <th class="center">Cantidad</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ex in extrasDeReserva" :key="ex.id">
                  <td><strong>{{ ex.nombre }}</strong></td>
                  <td class="right amber">$ {{ Number(ex.precio_por_dia).toFixed(2) }}</td>
                  <td class="center">{{ ex.ReservaExtra.cantidad }}</td>
                  <td>
                    <button class="btn-action btn-delete" @click="quitarExtraDeReserva(ex.id)">🗑️ Quitar</button>
                  </td>
                </tr>
                <tr v-if="extrasDeReserva.length === 0">
                  <td colspan="4" class="empty-row">Esta reserva no tiene extras asignados.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ══ SECCIÓN 3 — Multas ══ -->
      <section class="card card-orange">
        <h2 class="card-title">🚨 Multas por Atraso en Devolución</h2>

        <div class="sub-card">
          <p class="subsection-title">
            {{ mEditandoId ? '✏️ Editar Multa #' + mEditandoId : '➕ Registrar Nueva Multa' }}
          </p>

          <div class="form-grid-3">
            <div class="field">
              <label>Reserva <span class="req">*</span></label>
              <select v-model="mReservaId" :disabled="!!mEditandoId">
                <option value="">— Selecciona una reserva —</option>
                <option v-for="r in reservas" :key="r.id" :value="r.id">
                  #{{ r.id }} — {{ r.cliente_nombre }} (fin: {{ r.fecha_fin }})
                </option>
              </select>
            </div>
            <div class="field">
              <label>Fecha devolución real <span class="req">*</span></label>
              <input v-model="mFechaReal" type="date" />
            </div>
            <div class="field">
              <label>Tarifa por día <span class="req">*</span></label>
              <input v-model="mTarifa" type="number" min="0.01" step="0.01" placeholder="Ej: 50.00" />
            </div>
          </div>

          <!-- Preview atraso -->
          <div v-if="diasAtrasoPreview !== null" class="preview-box mt-sm">
            <div v-if="diasAtrasoPreview > 0" class="preview preview-warn">
              ⏰ Atraso estimado: <strong>{{ diasAtrasoPreview }} día{{ diasAtrasoPreview !== 1 ? 's' : '' }}</strong>
              <span v-if="mTarifa"> — Multa estimada: <strong>$ {{ (diasAtrasoPreview * Number(mTarifa)).toFixed(2) }}</strong></span>
            </div>
            <div v-else class="preview preview-ok">
              ✅ La devolución está dentro del plazo. No corresponde multa.
            </div>
          </div>

          <div class="form-grid-2 mt-sm">
            <div class="field">
              <label>Notas (opcional)</label>
              <input v-model="mNotas" type="text" placeholder="Ej: Cliente avisó con anticipación" />
            </div>
            <div class="field field-actions">
              <label>&nbsp;</label>
              <div class="btn-row">
                <button v-if="!mEditandoId" class="btn btn-orange" @click="crearMulta">🚨 Registrar Multa</button>
                <template v-else>
                  <button class="btn btn-save" @click="actualizarMulta">💾 Guardar</button>
                  <button class="btn btn-cancel" @click="limpiarMulta">✖</button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <p class="subsection-title mt">Multas Registradas</p>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>#</th><th>Reserva</th><th>Cliente</th><th>Vehículo</th>
                <th>Fin pactado</th><th>Devuelto</th>
                <th class="center">Días</th>
                <th class="right">Tarifa/día</th>
                <th class="right">Total</th>
                <th class="center">Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in multas" :key="m.id">
                <td><span class="id-badge">{{ m.id }}</span></td>
                <td><span class="id-badge">#{{ m.reserva_id }}</span></td>
                <td>{{ m.reserva?.cliente_nombre ?? '—' }}</td>
                <td class="muted">
                  {{ m.reserva?.Vehiculo ? `${m.reserva.Vehiculo.marca} ${m.reserva.Vehiculo.modelo}` : '—' }}
                </td>
                <td class="date">{{ m.reserva?.fecha_fin ?? '—' }}</td>
                <td class="date">{{ m.fecha_devolucion_real }}</td>
                <td class="center"><span class="days-late">{{ m.dias_atraso }}d</span></td>
                <td class="right muted">$ {{ Number(m.tarifa_por_dia).toFixed(2) }}</td>
                <td class="right amber"><strong>$ {{ Number(m.monto_total).toFixed(2) }}</strong></td>
                <td class="center">
                  <span :class="['pill', m.estado === 'pagada' ? 'pill-green' : 'pill-warn']">{{ m.estado }}</span>
                </td>
                <td class="actions-cell">
                  <button v-if="m.estado === 'pendiente'" class="btn-action btn-green" @click="marcarPagada(m)">✔ Cobrada</button>
                  <button class="btn-action btn-edit" @click="editarMulta(m)">✏️</button>
                  <button class="btn-action btn-delete" @click="eliminarMulta(m.id)">🗑️</button>
                </td>
              </tr>
              <tr v-if="multas.length === 0">
                <td colspan="11" class="empty-row">No hay multas registradas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ══ SECCIÓN 4 — Resumen de Costos ══ -->
      <section class="card card-green">
        <h2 class="card-title">💰 Resumen de Costos de una Reserva</h2>
        <p class="card-sub">Consultá el desglose completo: extras asignados + multa por atraso.</p>

        <div class="form-inline mt-sm">
          <div class="field" style="flex:1;">
            <label>Reserva</label>
            <select v-model="resumenReservaId">
              <option value="">— Selecciona una reserva —</option>
              <option v-for="r in reservas" :key="r.id" :value="r.id">
                #{{ r.id }} — {{ r.cliente_nombre }} ({{ r.fecha_inicio }} → {{ r.fecha_fin }})
              </option>
            </select>
          </div>
          <div class="field field-actions">
            <label>&nbsp;</label>
            <button class="btn btn-create" @click="cargarResumen">🔍 Ver resumen</button>
          </div>
        </div>

        <div v-if="resumen" class="resumen-box mt">
          <div class="resumen-meta">
            <div><span class="meta-label">Cliente</span><span>{{ resumen.cliente }}</span></div>
            <div>
              <span class="meta-label">Vehículo</span>
              <span>{{ resumen.vehiculo ? `${resumen.vehiculo.marca} ${resumen.vehiculo.modelo} (${resumen.vehiculo.patente})` : '—' }}</span>
            </div>
            <div><span class="meta-label">Período</span><span>{{ resumen.fecha_inicio }} → {{ resumen.fecha_fin }}</span></div>
            <div><span class="meta-label">Duración</span><span>{{ resumen.dias }} día{{ resumen.dias !== 1 ? 's' : '' }}</span></div>
            <div>
              <span class="meta-label">Estado</span>
              <span :class="['pill', `estado-${resumen.estado}`]">{{ resumen.estado }}</span>
            </div>
          </div>

          <p class="subsection-title mt">🎁 Extras</p>
          <div v-if="resumen.extras.length > 0" class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Extra</th><th class="right">Precio/día</th>
                  <th class="center">Cant.</th><th class="center">Días</th>
                  <th class="right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ex in resumen.extras" :key="ex.nombre">
                  <td>{{ ex.nombre }}</td>
                  <td class="right muted">$ {{ ex.precio_por_dia.toFixed(2) }}</td>
                  <td class="center">{{ ex.cantidad }}</td>
                  <td class="center">{{ resumen.dias }}</td>
                  <td class="right amber"><strong>$ {{ ex.subtotal.toFixed(2) }}</strong></td>
                </tr>
                <tr class="total-row">
                  <td colspan="4" class="right">Total extras:</td>
                  <td class="right amber"><strong>$ {{ resumen.total_extras.toFixed(2) }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="muted small mt-sm">Sin extras asignados.</p>

          <p class="subsection-title mt">🚨 Multa por Atraso</p>
          <div v-if="resumen.multa" class="preview preview-warn mt-sm">
            <strong>{{ resumen.multa.dias_atraso }} día{{ resumen.multa.dias_atraso !== 1 ? 's' : '' }} de atraso</strong>
            — Monto: <strong>$ {{ resumen.multa.monto.toFixed(2) }}</strong>
            <span :class="['pill', resumen.multa.estado === 'pagada' ? 'pill-green' : 'pill-warn']" style="margin-left:10px;">
              {{ resumen.multa.estado }}
            </span>
          </div>
          <p v-else class="muted small mt-sm">Sin multa registrada.</p>

          <div class="gran-total mt">
            💰 <strong>GRAN TOTAL (extras + multa): $ {{ resumen.gran_total.toFixed(2) }}</strong>
          </div>
        </div>
      </section>
    </main>

    <!-- Road strip -->
    <div class="road-strip"><div class="dashes"></div></div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

import { ref, computed, onMounted } from 'vue'
import { API_URL } from '../composables/api'

const extras          = ref([])
const multas          = ref([])
const reservas        = ref([])
const extrasDeReserva = ref([])
const resumen         = ref(null)

const errorMsg = ref('')
const okMsg    = ref('')
const limpiarMensajes = () => { errorMsg.value = ''; okMsg.value = '' }

const token       = () => localStorage.getItem('token')
const headers     = () => ({ Authorization: `Bearer ${token()}` })
const jsonHeaders = () => ({ 'Content-Type': 'application/json', ...headers() })

const eNombre      = ref('')
const eDescripcion = ref('')
const ePrecio      = ref('')
const eEditandoId  = ref(null)

const limpiarExtra = () => {
  eNombre.value = ''; eDescripcion.value = ''; ePrecio.value = ''; eEditandoId.value = null
}

const cargarExtras = async () => {
  const r = await fetch(`${API_URL}/extras`, { headers: headers() })
  extras.value = await r.json()
}

const crearExtra = async () => {
  limpiarMensajes()
  const r = await fetch(`${API_URL}/extras`, {
    method: 'POST', headers: jsonHeaders(),
    body: JSON.stringify({ nombre: eNombre.value, descripcion: eDescripcion.value, precio_por_dia: Number(ePrecio.value) })
  })
  const data = await r.json()
  if (!r.ok) { errorMsg.value = data.message || 'Error al crear extra.'; return }
  okMsg.value = 'Extra creado.'; limpiarExtra(); cargarExtras()
}

const editarExtra = (ex) => {
  limpiarMensajes()
  eEditandoId.value = ex.id; eNombre.value = ex.nombre
  eDescripcion.value = ex.descripcion || ''; ePrecio.value = ex.precio_por_dia
}

const actualizarExtra = async () => {
  limpiarMensajes()
  const r = await fetch(`${API_URL}/extras/${eEditandoId.value}`, {
    method: 'PUT', headers: jsonHeaders(),
    body: JSON.stringify({ nombre: eNombre.value, descripcion: eDescripcion.value, precio_por_dia: Number(ePrecio.value) })
  })
  const data = await r.json()
  if (!r.ok) { errorMsg.value = data.message || 'Error al actualizar.'; return }
  okMsg.value = 'Extra actualizado.'; limpiarExtra(); cargarExtras()
}

const eliminarExtra = async (id) => {
  limpiarMensajes()
  if (!confirm('¿Eliminar este extra?')) return
  await fetch(`${API_URL}/extras/${id}`, { method: 'DELETE', headers: headers() })
  okMsg.value = 'Extra eliminado.'; cargarExtras()
}

const asigReservaId = ref('')
const asigExtraId   = ref('')
const asigCantidad  = ref(1)

const cargarExtrasDeReserva = async () => {
  if (!asigReservaId.value) { extrasDeReserva.value = []; return }
  const r = await fetch(`${API_URL}/reservas/${asigReservaId.value}/extras`, { headers: headers() })
  extrasDeReserva.value = await r.json()
}

const agregarExtraAReserva = async () => {
  limpiarMensajes()
  if (!asigReservaId.value || !asigExtraId.value) { errorMsg.value = 'Selecciona una reserva y un extra.'; return }
  const r = await fetch(`${API_URL}/reservas/${asigReservaId.value}/extras`, {
    method: 'POST', headers: jsonHeaders(),
    body: JSON.stringify({ extra_id: Number(asigExtraId.value), cantidad: Number(asigCantidad.value) })
  })
  const data = await r.json()
  if (!r.ok) { errorMsg.value = data.message || 'Error al asignar extra.'; return }
  okMsg.value = data.mensaje; asigExtraId.value = ''; asigCantidad.value = 1
  cargarExtrasDeReserva()
}

const quitarExtraDeReserva = async (extraId) => {
  limpiarMensajes()
  await fetch(`${API_URL}/reservas/${asigReservaId.value}/extras/${extraId}`, { method: 'DELETE', headers: headers() })
  okMsg.value = 'Extra removido.'; cargarExtrasDeReserva()
}

const mReservaId  = ref('')
const mFechaReal  = ref('')
const mTarifa     = ref('')
const mNotas      = ref('')
const mEditandoId = ref(null)

const limpiarMulta = () => {
  mReservaId.value = ''; mFechaReal.value = ''; mTarifa.value = ''; mNotas.value = ''; mEditandoId.value = null
}

const diasAtrasoPreview = computed(() => {
  if (!mReservaId.value || !mFechaReal.value) return null
  const reserva = reservas.value.find(r => r.id === Number(mReservaId.value))
  if (!reserva) return null
  const fin  = new Date(reserva.fecha_fin)
  const real = new Date(mFechaReal.value)
  const diff = Math.floor((real - fin) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
})

const cargarMultas = async () => {
  const r = await fetch(`${API_URL}/multas`, { headers: headers() })
  multas.value = await r.json()
}

const crearMulta = async () => {
  limpiarMensajes()
  const r = await fetch(`${API_URL}/multas`, {
    method: 'POST', headers: jsonHeaders(),
    body: JSON.stringify({ reserva_id: Number(mReservaId.value), fecha_devolucion_real: mFechaReal.value, tarifa_por_dia: Number(mTarifa.value), notas: mNotas.value || null })
  })
  const data = await r.json()
  if (!r.ok) { errorMsg.value = data.message || 'Error al registrar multa.'; return }
  okMsg.value = 'Multa registrada correctamente.'; limpiarMulta(); cargarMultas()
}

const editarMulta = (m) => {
  limpiarMensajes()
  mEditandoId.value = m.id; mReservaId.value = m.reserva_id
  mFechaReal.value  = m.fecha_devolucion_real; mTarifa.value = m.tarifa_por_dia
  mNotas.value      = m.notas || ''
}

const actualizarMulta = async () => {
  limpiarMensajes()
  const r = await fetch(`${API_URL}/multas/${mEditandoId.value}`, {
    method: 'PUT', headers: jsonHeaders(),
    body: JSON.stringify({ fecha_devolucion_real: mFechaReal.value, tarifa_por_dia: Number(mTarifa.value), notas: mNotas.value || null })
  })
  const data = await r.json()
  if (!r.ok) { errorMsg.value = data.message || 'Error al actualizar multa.'; return }
  okMsg.value = 'Multa actualizada.'; limpiarMulta(); cargarMultas()
}

const marcarPagada = async (m) => {
  limpiarMensajes()
  const r = await fetch(`${API_URL}/multas/${m.id}`, {
    method: 'PUT', headers: jsonHeaders(), body: JSON.stringify({ estado: 'pagada' })
  })
  if (!r.ok) { errorMsg.value = 'Error al actualizar estado.'; return }
  okMsg.value = 'Multa marcada como cobrada.'; cargarMultas()
}

const eliminarMulta = async (id) => {
  limpiarMensajes()
  if (!confirm('¿Eliminar esta multa?')) return
  await fetch(`${API_URL}/multas/${id}`, { method: 'DELETE', headers: headers() })
  okMsg.value = 'Multa eliminada.'; cargarMultas()
}

const resumenReservaId = ref('')

const cargarResumen = async () => {
  limpiarMensajes()
  if (!resumenReservaId.value) { errorMsg.value = 'Selecciona una reserva.'; return }
  const r = await fetch(`${API_URL}/reservas/${resumenReservaId.value}/resumen`, { headers: headers() })
  const data = await r.json()
  if (!r.ok) { errorMsg.value = data.mensaje || 'Error al cargar resumen.'; return }
  resumen.value = data
}

const cargarReservas = async () => {
  const r = await fetch(`${API_URL}/reservas`, { headers: headers() })
  reservas.value = await r.json()
}

const logout = () => {
  localStorage.removeItem('token')
  navigateTo('/login')
}

onMounted(() => {
  cargarExtras(); cargarMultas(); cargarReservas()
})
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
.brand { font-size: 1.1rem; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
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
.nav-links button.active { background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.4); color: #f59e0b; }
.nav-links .logout { border-color: rgba(239,68,68,0.3); color: rgba(239,68,68,0.7); }
.nav-links .logout:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }

/* ── Container ── */
.container { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }
.page-header { margin-bottom: 1.75rem; }
.page-header h1 { font-size: 1.75rem; font-weight: 800; color: #fff; margin: 0 0 0.3rem; letter-spacing: -0.5px; }
.subtitle { color: rgba(255,255,255,0.35); font-size: 0.88rem; margin: 0; }

/* ── Banners ── */
.banner {
  padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.88rem;
  margin-bottom: 1rem; border: 1px solid;
}
.banner-error { background: rgba(239,68,68,0.1); color: #fca5a5; border-color: rgba(239,68,68,0.25); }
.banner-ok    { background: rgba(34,197,94,0.1); color: #86efac; border-color: rgba(34,197,94,0.25); }

/* ── Cards / Sections ── */
.card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
}
.card-blue   { border-color: rgba(59,130,246,0.2); }
.card-orange { border-color: rgba(245,158,11,0.2); }
.card-green  { border-color: rgba(34,197,94,0.2); }

.card-title { font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 0.3rem; }
.card-sub   { color: rgba(255,255,255,0.35); font-size: 0.83rem; margin: 0 0 1.25rem; }

.sub-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.subsection-title {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: rgba(255,255,255,0.4);
  margin: 0 0 0.75rem;
}

/* ── Forms ── */
.form-grid-4 { display: grid; grid-template-columns: 2fr 3fr 1fr auto; gap: 0.9rem; align-items: end; }
.form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.9rem; }
.form-grid-2 { display: grid; grid-template-columns: 1fr auto; gap: 0.9rem; align-items: end; }
.form-inline { display: flex; gap: 0.9rem; align-items: end; }

.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-actions { justify-content: flex-end; }

.field label {
  font-size: 0.72rem; font-weight: 600;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase; letter-spacing: 0.7px;
}
.req { color: #f59e0b; }

.field input,
.field select {
  padding: 0.6rem 0.85rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9px;
  font-size: 0.88rem;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  color-scheme: dark;
}
.field input::placeholder { color: rgba(255,255,255,0.2); }
.field input:focus,
.field select:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
.field select option { background: #1a1a2e; }
.field select:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-row { display: flex; gap: 0.5rem; }

/* ── Buttons ── */
.btn {
  padding: 0.6rem 1.2rem; border: none; border-radius: 9px;
  font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 700;
  cursor: pointer; white-space: nowrap;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn-create { background: #f59e0b; color: #0f0f1a; }
.btn-create:hover { background: #fbbf24; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(245,158,11,0.3); }
.btn-save   { background: rgba(59,130,246,0.8); color: #fff; }
.btn-save:hover { background: #3b82f6; transform: translateY(-1px); }
.btn-cancel { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.1); }
.btn-cancel:hover { background: rgba(255,255,255,0.11); color: #fff; }
.btn-orange { background: rgba(245,120,11,0.85); color: #fff; }
.btn-orange:hover { background: #f97316; transform: translateY(-1px); }

/* ── Table ── */
.table-wrapper { border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.02); font-size: 0.84rem; }
.table th {
  background: rgba(245,158,11,0.07); color: rgba(245,158,11,0.7);
  padding: 0.65rem 0.9rem; text-align: left;
  font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px;
  border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap;
}
.table td { padding: 0.65rem 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover td { background: rgba(255,255,255,0.03); color: #fff; }
.total-row td { background: rgba(245,158,11,0.06); font-size: 0.85rem; }

.id-badge { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.35); font-size: 0.72rem; font-weight: 600; padding: 0.1rem 0.45rem; border-radius: 5px; }
.muted { color: rgba(255,255,255,0.35); }
.small { font-size: 0.83rem; }
.right  { text-align: right; }
.center { text-align: center; }
.amber  { color: #f59e0b; }
.date   { color: rgba(255,255,255,0.45); font-size: 0.82rem; }

.days-late { color: #fca5a5; font-weight: 700; font-size: 0.82rem; }

/* ── Pills ── */
.pill { display: inline-block; padding: 0.18rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: capitalize; letter-spacing: 0.3px; }
.pill-green { background: rgba(34,197,94,0.1);  color: #86efac; border: 1px solid rgba(34,197,94,0.22); }
.pill-red   { background: rgba(239,68,68,0.1);  color: #fca5a5; border: 1px solid rgba(239,68,68,0.22); }
.pill-warn  { background: rgba(234,179,8,0.12); color: #fde047; border: 1px solid rgba(234,179,8,0.25); }
.estado-confirmada { background: rgba(34,197,94,0.1);  color: #86efac; border: 1px solid rgba(34,197,94,0.22); }
.estado-pendiente  { background: rgba(234,179,8,0.12); color: #fde047; border: 1px solid rgba(234,179,8,0.25); }
.estado-cancelada  { background: rgba(239,68,68,0.1);  color: #fca5a5; border: 1px solid rgba(239,68,68,0.22); }

/* ── Action buttons ── */
.actions-cell { white-space: nowrap; }
.btn-action { border: none; padding: 0.28rem 0.65rem; border-radius: 6px; font-size: 0.72rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity 0.2s, transform 0.15s; margin-right: 4px; }
.btn-action:last-child { margin-right: 0; }
.btn-action:hover { opacity: 0.85; transform: translateY(-1px); }
.btn-edit   { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }
.btn-delete { background: rgba(239,68,68,0.1);  color: #fca5a5; border: 1px solid rgba(239,68,68,0.22); }
.btn-green  { background: rgba(34,197,94,0.1);  color: #86efac; border: 1px solid rgba(34,197,94,0.22); }

/* ── Preview box ── */
.preview { padding: 0.7rem 1rem; border-radius: 9px; font-size: 0.85rem; border: 1px solid; }
.preview-warn { background: rgba(234,179,8,0.08); color: #fde047; border-color: rgba(234,179,8,0.25); }
.preview-ok   { background: rgba(34,197,94,0.08); color: #86efac; border-color: rgba(34,197,94,0.22); }

/* ── Resumen ── */
.resumen-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1.25rem; }
.resumen-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1.5rem; font-size: 0.88rem; margin-bottom: 0.5rem; }
.resumen-meta > div { display: flex; gap: 0.5rem; align-items: center; }
.meta-label { color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
.gran-total { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.22); color: #86efac; border-radius: 10px; padding: 0.85rem 1.1rem; font-size: 1rem; text-align: right; }

/* ── Spacing helpers ── */
.mt    { margin-top: 1.25rem; }
.mt-sm { margin-top: 0.75rem; }

/* ── Empty row ── */
.empty-row { text-align: center; color: rgba(255,255,255,0.22); padding: 2rem !important; font-size: 0.88rem; }

/* ── Road strip ── */
.road-strip { position: fixed; bottom: 0; left: 0; right: 0; height: 48px; background: #1a1a2e; border-top: 2px solid #2a2a45; overflow: hidden; }
.dashes { position: absolute; top: 50%; left: -120px; right: 0; height: 4px; margin-top: -2px; background: repeating-linear-gradient(to right, #f59e0b 0px, #f59e0b 40px, transparent 40px, transparent 80px); animation: drive 1.4s linear infinite; }
@keyframes drive { from { transform: translateX(0); } to { transform: translateX(80px); } }
@media (prefers-reduced-motion: reduce) { .dashes { animation: none; } }

@media (max-width: 900px) {
  .form-grid-4 { grid-template-columns: 1fr 1fr; }
  .resumen-meta { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .navbar { padding: 0 1rem; }
  .nav-links button { padding: 0.35rem 0.6rem; font-size: 0.75rem; }
  .form-grid-4, .form-grid-3, .form-grid-2, .form-inline { grid-template-columns: 1fr; flex-direction: column; }
}
</style>