<template>
  <div class="page">

    <!-- ── Navbar ── -->
    <nav class="navbar">
      <span class="brand">🚗 Rent<span class="brand-accent">A</span>Car</span>
      <div class="nav-links">
        <button class="active" @click="navigateTo('/panel')">Panel</button>
        <button @click="navigateTo('/vehiculos')">Vehículos</button>
        <button @click="navigateTo('/reservas')">Reservas</button>
        <button @click="navigateTo('/disponibilidad')">Disponibilidad</button>
        <button @click="navigateTo('/rq-10')">Extras & Multas</button>
        <button class="logout" @click="logout">Cerrar sesión</button>
      </div>
    </nav>

    <main class="container">

      <!-- Estado de carga -->
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando panel...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="banner banner-error">⚠️ {{ error }}</div>

      <!-- Contenido -->
      <div v-else-if="datos">

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🚗</div>
            <div class="stat-info">
              <span class="stat-label">Flota total</span>
              <span class="stat-number">{{ datos.flota?.total ?? 0 }}</span>
            </div>
          </div>
          <div class="stat-card stat-green">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <span class="stat-label">Vehículos libres</span>
              <span class="stat-number">{{ datos.flota?.libres ?? 0 }}</span>
            </div>
          </div>
          <div class="stat-card stat-amber">
            <div class="stat-icon">⏳</div>
            <div class="stat-info">
              <span class="stat-label">Vehículos ocupados</span>
              <span class="stat-number">{{ datos.flota?.ocupados ?? 0 }}</span>
            </div>
          </div>
          <div class="stat-card stat-blue">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <span class="stat-label">Total reservas</span>
              <span class="stat-number">{{ datos.reservas?.total ?? 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Estado de reservas + Botón en misma fila -->
        <div class="section-header">
          <h2 class="section-title">Estado de Reservas</h2>
          <button @click="cargarPanel" class="btn-update">🔄 Actualizar</button>
        </div>

        <div class="estados-grid">
          <div class="estado-card estado-pendiente">
            <span class="estado-count">{{ datos.reservas?.pendientes ?? 0 }}</span>
            <span class="estado-label">Pendientes</span>
          </div>
          <div class="estado-card estado-confirmada">
            <span class="estado-count">{{ datos.reservas?.confirmadas ?? 0 }}</span>
            <span class="estado-label">Confirmadas</span>
          </div>
          <div class="estado-card estado-cancelada">
            <span class="estado-count">{{ datos.reservas?.canceladas ?? 0 }}</span>
            <span class="estado-label">Canceladas</span>
          </div>
        </div>

        <!-- Últimas reservas -->
        <h2 class="section-title" style="margin-top: 2.5rem;">Últimas Reservas</h2>

        <div v-if="datos.ultimasReservas?.length === 0" class="empty-state">
          No hay reservas registradas aún.
        </div>
        <div v-else class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Vehículo</th>
                <th>Cliente</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in datos.ultimasReservas" :key="r.id">
                <td><span class="id-badge">{{ r.id }}</span></td>
                <td>
                  <span v-if="r.Vehiculo">
                    <strong>{{ r.Vehiculo.marca }} {{ r.Vehiculo.modelo }}</strong>
                    <span class="patente"> {{ r.Vehiculo.patente }}</span>
                  </span>
                  <span v-else class="muted">—</span>
                </td>
                <td>{{ r.cliente_nombre }}</td>
                <td class="date">{{ formatFecha(r.fecha_inicio) }}</td>
                <td class="date">{{ formatFecha(r.fecha_fin) }}</td>
                <td>
                  <span :class="['estado-badge', `estado-${r.estado}`]">
                    {{ r.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-CL')
}

onMounted(() => cargarPanel())
</script>

<style>
/* Reset global para eliminar márgenes blancos */
html, body {
  margin: 0;
  padding: 0;
  background: #0f0f1a;
}
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

.brand {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
  white-space: nowrap;
}
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
.nav-links .logout {
  border-color: rgba(239,68,68,0.3);
  color: rgba(239,68,68,0.7);
}
.nav-links .logout:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }

/* ── Container ── */
.container { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }

/* ── Loading ── */
.loading-state {
  text-align: center;
  padding: 5rem 0;
  color: rgba(255,255,255,0.3);
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(245,158,11,0.15);
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Banner ── */
.banner-error {
  background: rgba(239,68,68,0.1);
  color: #fca5a5;
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.88rem;
}

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 1.4rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, border-color 0.2s;
}
.stat-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.18); }

.stat-icon {
  font-size: 1.6rem;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(255,255,255,0.06);
  flex-shrink: 0;
}

.stat-green .stat-icon { background: rgba(34,197,94,0.1); }
.stat-amber .stat-icon { background: rgba(245,158,11,0.1); }
.stat-blue  .stat-icon { background: rgba(59,130,246,0.1); }

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255,255,255,0.38);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  letter-spacing: -1px;
}

.stat-green .stat-number { color: #86efac; }
.stat-amber .stat-number { color: #f59e0b; }
.stat-blue  .stat-number { color: #93c5fd; }

/* ── Section header ── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.btn-update {
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.25);
  color: #f59e0b;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-update:hover { background: rgba(245,158,11,0.18); transform: translateY(-1px); }

/* ── Estados grid ── */
.estados-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.estado-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  transition: transform 0.2s;
}
.estado-card:hover { transform: translateY(-2px); }

.estado-count {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}
.estado-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: rgba(255,255,255,0.4);
}

.estado-pendiente  { border-color: rgba(234,179,8,0.2); }
.estado-pendiente  .estado-count { color: #fde047; }
.estado-confirmada { border-color: rgba(34,197,94,0.2); }
.estado-confirmada .estado-count { color: #86efac; }
.estado-cancelada  { border-color: rgba(239,68,68,0.2); }
.estado-cancelada  .estado-count { color: #fca5a5; }

/* ── Empty ── */
.empty-state {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 3rem;
  text-align: center;
  color: rgba(255,255,255,0.25);
  font-size: 0.9rem;
}

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
  font-size: 0.78rem;
  color: #f59e0b;
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.15);
  padding: 0.1rem 0.4rem;
  border-radius: 5px;
  margin-left: 4px;
}

.date { color: rgba(255,255,255,0.45); font-size: 0.82rem; }
.muted { color: rgba(255,255,255,0.25); }

.estado-badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.3px;
}
.estado-pendiente  { background: rgba(234,179,8,0.12);  color: #fde047; border: 1px solid rgba(234,179,8,0.25); }
.estado-confirmada { background: rgba(34,197,94,0.1);   color: #86efac; border: 1px solid rgba(34,197,94,0.22); }
.estado-cancelada  { background: rgba(239,68,68,0.1);   color: #fca5a5; border: 1px solid rgba(239,68,68,0.22); }

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
  .spinner { animation: none; }
}

@media (max-width: 768px) {
  .navbar { padding: 0 1rem; }
  .nav-links button { padding: 0.35rem 0.6rem; font-size: 0.75rem; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .estados-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>