<template>
  <div style="font-family: Arial, sans-serif; max-width: 1100px; margin: 0 auto; padding: 20px;">

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
      <button @click="navigateTo('/reservas')"
              style="background:#16213e; color:#e2e2e2; border:1px solid #0f3460;
                     padding:8px 14px; border-radius:5px; cursor:pointer;">
        📋 Reservas
      </button>
      <button @click="navigateTo('/disponibilidad')"
              style="background:#16213e; color:#e2e2e2; border:1px solid #0f3460;
                     padding:8px 14px; border-radius:5px; cursor:pointer;">
        🔍 Disponibilidad
      </button>
      <button style="background:#0f3460; color:#fff; border:1px solid #e94560;
                     padding:8px 14px; border-radius:5px; cursor:pointer;">
        ⚙️ Extras & Multas
      </button>
      <button @click="logout"
              style="margin-left:auto; background:#c0392b; color:#fff; border:none;
                     padding:8px 14px; border-radius:5px; cursor:pointer;">
        Cerrar sesión
      </button>
    </nav>

    <h1>⚙️ Extras y Multas por Atraso — RQ-10</h1>

    <!-- ── Banners globales ────────────────────────────────────────────────── -->
    <div v-if="errorMsg"
         style="background:#fdecea; color:#c0392b; border:1px solid #e74c3c;
                border-radius:6px; padding:12px 16px; margin-bottom:14px;">
      ⚠️ {{ errorMsg }}
    </div>
    <div v-if="okMsg"
         style="background:#eafaf1; color:#1e8449; border:1px solid #27ae60;
                border-radius:6px; padding:12px 16px; margin-bottom:14px;">
      ✅ {{ okMsg }}
    </div>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- SECCIÓN 1 — Catálogo de Extras                                        -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section style="background:#f8f9fa; border:1px solid #dee2e6; border-radius:8px;
                    padding:20px; margin-bottom:30px;">

      <h2 style="margin-top:0;">🎁 Catálogo de Extras</h2>
      <p style="color:#555; margin-top:-8px; margin-bottom:16px; font-size:14px;">
        Define los servicios adicionales disponibles (GPS, silla infantil, seguro extra, etc.).
      </p>

      <!-- Formulario crear / editar extra -->
      <div style="display:grid; grid-template-columns:2fr 3fr 1fr auto; gap:10px;
                  align-items:end; margin-bottom:16px; flex-wrap:wrap;">
        <div>
          <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Nombre *</label>
          <input v-model="eNombre" type="text" placeholder="Ej: GPS"
                 style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
        </div>
        <div>
          <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Descripción</label>
          <input v-model="eDescripcion" type="text" placeholder="Descripción opcional"
                 style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
        </div>
        <div>
          <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Precio/día *</label>
          <input v-model="ePrecio" type="number" min="0" step="0.01" placeholder="0.00"
                 style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
        </div>
        <div style="display:flex; gap:8px;">
          <button v-if="!eEditandoId" @click="crearExtra"
                  style="background:#27ae60; color:#fff; border:none; padding:9px 16px;
                         border-radius:5px; cursor:pointer; white-space:nowrap;">
            ✚ Agregar
          </button>
          <template v-else>
            <button @click="actualizarExtra"
                    style="background:#2980b9; color:#fff; border:none; padding:9px 14px;
                           border-radius:5px; cursor:pointer;">
              💾 Guardar
            </button>
            <button @click="limpiarExtra"
                    style="background:#7f8c8d; color:#fff; border:none; padding:9px 10px;
                           border-radius:5px; cursor:pointer;">
              ✖
            </button>
          </template>
        </div>
      </div>

      <!-- Tabla de extras -->
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <thead>
            <tr style="background:#1a1a2e; color:#fff;">
              <th style="padding:9px 12px; text-align:left;">ID</th>
              <th style="padding:9px 12px; text-align:left;">Nombre</th>
              <th style="padding:9px 12px; text-align:left;">Descripción</th>
              <th style="padding:9px 12px; text-align:right;">Precio/día</th>
              <th style="padding:9px 12px; text-align:center;">Activo</th>
              <th style="padding:9px 12px; text-align:left;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ex, i) in extras" :key="ex.id"
                :style="{ background: i % 2 === 0 ? '#ffffff' : '#f2f2f2' }">
              <td style="padding:7px 12px;">{{ ex.id }}</td>
              <td style="padding:7px 12px; font-weight:bold;">{{ ex.nombre }}</td>
              <td style="padding:7px 12px; color:#555;">{{ ex.descripcion || '—' }}</td>
              <td style="padding:7px 12px; text-align:right;">$ {{ Number(ex.precio_por_dia).toFixed(2) }}</td>
              <td style="padding:7px 12px; text-align:center;">
                <span :style="ex.activo
                  ? 'background:#d1e7dd;color:#0f5132;padding:2px 8px;border-radius:12px;font-size:12px;'
                  : 'background:#f8d7da;color:#842029;padding:2px 8px;border-radius:12px;font-size:12px;'">
                  {{ ex.activo ? 'Sí' : 'No' }}
                </span>
              </td>
              <td style="padding:7px 12px; white-space:nowrap;">
                <button @click="editarExtra(ex)"
                        style="background:#f39c12; color:#fff; border:none; padding:5px 10px;
                               border-radius:4px; cursor:pointer; margin-right:5px;">
                  ✏️ Editar
                </button>
                <button @click="eliminarExtra(ex.id)"
                        style="background:#e74c3c; color:#fff; border:none; padding:5px 10px;
                               border-radius:4px; cursor:pointer;">
                  🗑️
                </button>
              </td>
            </tr>
            <tr v-if="extras.length === 0">
              <td colspan="6" style="padding:18px; text-align:center; color:#888;">
                No hay extras definidos aún.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- SECCIÓN 2 — Asignar Extras a una Reserva                              -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section style="background:#f0f4ff; border:1px solid #b8c7e8; border-radius:8px;
                    padding:20px; margin-bottom:30px;">

      <h2 style="margin-top:0;">📎 Asignar Extras a una Reserva</h2>

      <div style="display:grid; grid-template-columns:1fr 1fr 100px auto; gap:10px; align-items:end; margin-bottom:16px;">
        <div>
          <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Reserva *</label>
          <select v-model="asigReservaId" @change="cargarExtrasDeReserva"
                  style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px;">
            <option value="">-- Selecciona una reserva --</option>
            <option v-for="r in reservas" :key="r.id" :value="r.id">
              #{{ r.id }} — {{ r.cliente_nombre }} ({{ r.fecha_inicio }} → {{ r.fecha_fin }})
            </option>
          </select>
        </div>
        <div>
          <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Extra *</label>
          <select v-model="asigExtraId"
                  style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px;">
            <option value="">-- Selecciona un extra --</option>
            <option v-for="ex in extras.filter(e => e.activo)" :key="ex.id" :value="ex.id">
              {{ ex.nombre }} — ${{ Number(ex.precio_por_dia).toFixed(2) }}/día
            </option>
          </select>
        </div>
        <div>
          <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Cant.</label>
          <input v-model="asigCantidad" type="number" min="1"
                 style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
        </div>
        <button @click="agregarExtraAReserva"
                style="background:#0f3460; color:#fff; border:none; padding:9px 14px;
                       border-radius:5px; cursor:pointer; white-space:nowrap;">
          ➕ Agregar
        </button>
      </div>

      <!-- Extras actualmente asignados a la reserva seleccionada -->
      <div v-if="asigReservaId">
        <h3 style="font-size:15px; margin-bottom:8px;">
          Extras en Reserva #{{ asigReservaId }}
        </h3>
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <thead>
            <tr style="background:#0f3460; color:#fff;">
              <th style="padding:8px 12px; text-align:left;">Extra</th>
              <th style="padding:8px 12px; text-align:right;">Precio/día</th>
              <th style="padding:8px 12px; text-align:center;">Cantidad</th>
              <th style="padding:8px 12px; text-align:left;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ex, i) in extrasDeReserva" :key="ex.id"
                :style="{ background: i % 2 === 0 ? '#ffffff' : '#eef1fa' }">
              <td style="padding:7px 12px; font-weight:bold;">{{ ex.nombre }}</td>
              <td style="padding:7px 12px; text-align:right;">$ {{ Number(ex.precio_por_dia).toFixed(2) }}</td>
              <td style="padding:7px 12px; text-align:center;">{{ ex.ReservaExtra.cantidad }}</td>
              <td style="padding:7px 12px;">
                <button @click="quitarExtraDeReserva(ex.id)"
                        style="background:#e74c3c; color:#fff; border:none; padding:4px 10px;
                               border-radius:4px; cursor:pointer;">
                  🗑️ Quitar
                </button>
              </td>
            </tr>
            <tr v-if="extrasDeReserva.length === 0">
              <td colspan="4" style="padding:14px; text-align:center; color:#888;">
                Esta reserva no tiene extras asignados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- SECCIÓN 3 — Multas por Atraso                                         -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section style="background:#fff8f0; border:1px solid #f5c99a; border-radius:8px;
                    padding:20px; margin-bottom:30px;">

      <h2 style="margin-top:0;">🚨 Multas por Atraso en Devolución</h2>

      <!-- Formulario registrar multa -->
      <div style="background:#fff; border:1px solid #f5c99a; border-radius:6px; padding:16px; margin-bottom:20px;">
        <h3 style="margin-top:0; font-size:15px;">
          {{ mEditandoId ? '✏️ Editar Multa #' + mEditandoId : '➕ Registrar Nueva Multa' }}
        </h3>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:12px;">
          <div>
            <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Reserva *</label>
            <select v-model="mReservaId" :disabled="!!mEditandoId"
                    style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px;">
              <option value="">-- Selecciona una reserva --</option>
              <option v-for="r in reservas" :key="r.id" :value="r.id">
                #{{ r.id }} — {{ r.cliente_nombre }} (fin: {{ r.fecha_fin }})
              </option>
            </select>
          </div>
          <div>
            <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">📅 Fecha devolución real *</label>
            <input v-model="mFechaReal" type="date"
                   style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
          </div>
          <div>
            <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Tarifa por día atraso *</label>
            <input v-model="mTarifa" type="number" min="0.01" step="0.01" placeholder="Ej: 50.00"
                   style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
          </div>
        </div>

        <!-- Preview cálculo -->
        <div v-if="diasAtrasoPreview !== null" style="margin-bottom:12px;">
          <div v-if="diasAtrasoPreview > 0"
               style="background:#fef3cd; border:1px solid #ffc107; border-radius:5px;
                      padding:10px 14px; color:#856404; font-weight:bold;">
            ⏰ Atraso estimado: <strong>{{ diasAtrasoPreview }} día{{ diasAtrasoPreview !== 1 ? 's' : '' }}</strong>
            <span v-if="mTarifa"> — Multa estimada: <strong>$ {{ (diasAtrasoPreview * Number(mTarifa)).toFixed(2) }}</strong></span>
          </div>
          <div v-else
               style="background:#d1e7dd; border:1px solid #198754; border-radius:5px;
                      padding:10px 14px; color:#0f5132;">
            ✅ La fecha de devolución está dentro del plazo pactado. No corresponde multa.
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr auto; gap:10px; align-items:end;">
          <div>
            <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Notas (opcional)</label>
            <input v-model="mNotas" type="text" placeholder="Ej: Cliente avisó con anticipación"
                   style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px; box-sizing:border-box;" />
          </div>
          <div style="display:flex; gap:8px;">
            <button v-if="!mEditandoId" @click="crearMulta"
                    style="background:#e67e22; color:#fff; border:none; padding:9px 16px;
                           border-radius:5px; cursor:pointer;">
              🚨 Registrar Multa
            </button>
            <template v-else>
              <button @click="actualizarMulta"
                      style="background:#2980b9; color:#fff; border:none; padding:9px 14px;
                             border-radius:5px; cursor:pointer;">
                💾 Guardar
              </button>
              <button @click="limpiarMulta"
                      style="background:#7f8c8d; color:#fff; border:none; padding:9px 10px;
                             border-radius:5px; cursor:pointer;">
                ✖
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Tabla de multas -->
      <h3 style="font-size:15px; margin-bottom:8px;">📄 Multas Registradas</h3>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <thead>
            <tr style="background:#7d4e00; color:#fff;">
              <th style="padding:9px 12px; text-align:left;">ID</th>
              <th style="padding:9px 12px; text-align:left;">Reserva</th>
              <th style="padding:9px 12px; text-align:left;">Cliente</th>
              <th style="padding:9px 12px; text-align:left;">Vehículo</th>
              <th style="padding:9px 12px; text-align:left;">Fin pactado</th>
              <th style="padding:9px 12px; text-align:left;">Devuelto</th>
              <th style="padding:9px 12px; text-align:center;">Días atraso</th>
              <th style="padding:9px 12px; text-align:right;">Tarifa/día</th>
              <th style="padding:9px 12px; text-align:right;">Monto total</th>
              <th style="padding:9px 12px; text-align:center;">Estado</th>
              <th style="padding:9px 12px; text-align:left;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, i) in multas" :key="m.id"
                :style="{ background: i % 2 === 0 ? '#ffffff' : '#fdf6ee' }">
              <td style="padding:7px 12px;">{{ m.id }}</td>
              <td style="padding:7px 12px;">#{{ m.reserva_id }}</td>
              <td style="padding:7px 12px;">{{ m.reserva?.cliente_nombre ?? '—' }}</td>
              <td style="padding:7px 12px;">
                {{ m.reserva?.Vehiculo ? `${m.reserva.Vehiculo.marca} ${m.reserva.Vehiculo.modelo}` : '—' }}
              </td>
              <td style="padding:7px 12px;">{{ m.reserva?.fecha_fin ?? '—' }}</td>
              <td style="padding:7px 12px;">{{ m.fecha_devolucion_real }}</td>
              <td style="padding:7px 12px; text-align:center; font-weight:bold; color:#c0392b;">
                {{ m.dias_atraso }}
              </td>
              <td style="padding:7px 12px; text-align:right;">$ {{ Number(m.tarifa_por_dia).toFixed(2) }}</td>
              <td style="padding:7px 12px; text-align:right; font-weight:bold;">
                $ {{ Number(m.monto_total).toFixed(2) }}
              </td>
              <td style="padding:7px 12px; text-align:center;">
                <span :style="m.estado === 'pagada'
                  ? 'background:#d1e7dd;color:#0f5132;padding:2px 8px;border-radius:12px;font-size:12px;'
                  : 'background:#fef3cd;color:#856404;padding:2px 8px;border-radius:12px;font-size:12px;'">
                  {{ m.estado }}
                </span>
              </td>
              <td style="padding:7px 12px; white-space:nowrap;">
                <button v-if="m.estado === 'pendiente'" @click="marcarPagada(m)"
                        style="background:#27ae60; color:#fff; border:none; padding:4px 9px;
                               border-radius:4px; cursor:pointer; margin-right:4px; font-size:12px;">
                  ✔ Cobrada
                </button>
                <button @click="editarMulta(m)"
                        style="background:#f39c12; color:#fff; border:none; padding:4px 9px;
                               border-radius:4px; cursor:pointer; margin-right:4px;">
                  ✏️
                </button>
                <button @click="eliminarMulta(m.id)"
                        style="background:#e74c3c; color:#fff; border:none; padding:4px 9px;
                               border-radius:4px; cursor:pointer;">
                  🗑️
                </button>
              </td>
            </tr>
            <tr v-if="multas.length === 0">
              <td colspan="11" style="padding:18px; text-align:center; color:#888;">
                No hay multas registradas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <!-- SECCIÓN 4 — Resumen / Reporte de Costos de una Reserva                -->
    <!-- ══════════════════════════════════════════════════════════════════════ -->
    <section style="background:#f0fff4; border:1px solid #8fd4b0; border-radius:8px;
                    padding:20px; margin-bottom:30px;">

      <h2 style="margin-top:0;">💰 Resumen de Costos de una Reserva</h2>
      <p style="color:#555; margin-top:-8px; margin-bottom:16px; font-size:14px;">
        Consulta el desglose completo: extras asignados + multa por atraso (si aplica).
      </p>

      <div style="display:flex; gap:10px; align-items:flex-end; margin-bottom:20px;">
        <div style="flex:1;">
          <label style="display:block; font-weight:bold; font-size:13px; margin-bottom:3px;">Reserva</label>
          <select v-model="resumenReservaId"
                  style="width:100%; padding:8px; border:1px solid #ced4da; border-radius:4px;">
            <option value="">-- Selecciona una reserva --</option>
            <option v-for="r in reservas" :key="r.id" :value="r.id">
              #{{ r.id }} — {{ r.cliente_nombre }} ({{ r.fecha_inicio }} → {{ r.fecha_fin }})
            </option>
          </select>
        </div>
        <button @click="cargarResumen"
                style="background:#155724; color:#fff; border:none; padding:9px 18px;
                       border-radius:5px; cursor:pointer;">
          🔍 Ver resumen
        </button>
      </div>

      <!-- Resumen resultado -->
      <div v-if="resumen" style="background:#fff; border:1px solid #8fd4b0; border-radius:6px; padding:16px;">

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px; font-size:14px;">
          <div><strong>Cliente:</strong> {{ resumen.cliente }}</div>
          <div><strong>Vehículo:</strong>
            {{ resumen.vehiculo ? `${resumen.vehiculo.marca} ${resumen.vehiculo.modelo} (${resumen.vehiculo.patente})` : '—' }}
          </div>
          <div><strong>Período:</strong> {{ resumen.fecha_inicio }} → {{ resumen.fecha_fin }}</div>
          <div><strong>Duración:</strong> {{ resumen.dias }} día{{ resumen.dias !== 1 ? 's' : '' }}</div>
          <div><strong>Estado:</strong>
            <span style="background:#e2e8f0; padding:1px 8px; border-radius:10px; font-size:13px;">
              {{ resumen.estado }}
            </span>
          </div>
        </div>

        <!-- Extras -->
        <h4 style="margin-bottom:8px;">🎁 Extras</h4>
        <table v-if="resumen.extras.length > 0"
               style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:12px;">
          <thead>
            <tr style="background:#e8f5e9;">
              <th style="padding:6px 10px; text-align:left;">Extra</th>
              <th style="padding:6px 10px; text-align:right;">Precio/día</th>
              <th style="padding:6px 10px; text-align:center;">Cant.</th>
              <th style="padding:6px 10px; text-align:center;">Días</th>
              <th style="padding:6px 10px; text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ex in resumen.extras" :key="ex.nombre">
              <td style="padding:5px 10px;">{{ ex.nombre }}</td>
              <td style="padding:5px 10px; text-align:right;">$ {{ ex.precio_por_dia.toFixed(2) }}</td>
              <td style="padding:5px 10px; text-align:center;">{{ ex.cantidad }}</td>
              <td style="padding:5px 10px; text-align:center;">{{ resumen.dias }}</td>
              <td style="padding:5px 10px; text-align:right; font-weight:bold;">$ {{ ex.subtotal.toFixed(2) }}</td>
            </tr>
            <tr style="background:#f0fff4; font-weight:bold;">
              <td colspan="4" style="padding:6px 10px; text-align:right;">Total extras:</td>
              <td style="padding:6px 10px; text-align:right;">$ {{ resumen.total_extras.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else style="color:#888; font-size:13px; margin-bottom:12px;">Sin extras asignados.</p>

        <!-- Multa -->
        <h4 style="margin-bottom:8px;">🚨 Multa por Atraso</h4>
        <div v-if="resumen.multa"
             style="background:#fef3cd; border:1px solid #ffc107; border-radius:5px;
                    padding:10px 14px; font-size:13px; margin-bottom:12px;">
          <strong>{{ resumen.multa.dias_atraso }} día{{ resumen.multa.dias_atraso !== 1 ? 's' : '' }} de atraso</strong>
          — Monto: <strong>$ {{ resumen.multa.monto.toFixed(2) }}</strong>
          <span :style="resumen.multa.estado === 'pagada'
            ? 'margin-left:10px; background:#d1e7dd; color:#0f5132; padding:2px 8px; border-radius:12px;'
            : 'margin-left:10px; background:#fde8e8; color:#b91c1c; padding:2px 8px; border-radius:12px;'">
            {{ resumen.multa.estado }}
          </span>
        </div>
        <p v-else style="color:#888; font-size:13px; margin-bottom:12px;">Sin multa registrada.</p>

        <!-- Gran total -->
        <div style="background:#155724; color:#fff; border-radius:6px; padding:12px 16px;
                    font-size:17px; text-align:right;">
          💰 <strong>GRAN TOTAL (extras + multa): $ {{ resumen.gran_total.toFixed(2) }}</strong>
        </div>
      </div>

    </section>

  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

import { ref, computed, watch, onMounted } from 'vue'
import { API_URL } from '../composables/api'

// ── Estado global ─────────────────────────────────────────────────────────────
const extras          = ref([])
const multas          = ref([])
const reservas        = ref([])
const extrasDeReserva = ref([])
const resumen         = ref(null)

const errorMsg = ref('')
const okMsg    = ref('')
const limpiarMensajes = () => { errorMsg.value = ''; okMsg.value = '' }

const token = () => localStorage.getItem('token')
const headers = () => ({ Authorization: `Bearer ${token()}` })
const jsonHeaders = () => ({ 'Content-Type': 'application/json', ...headers() })

// ── EXTRAS: formulario ────────────────────────────────────────────────────────
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

// ── ASIGNAR EXTRAS A RESERVA ──────────────────────────────────────────────────
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
  if (!asigReservaId.value || !asigExtraId.value) {
    errorMsg.value = 'Selecciona una reserva y un extra.'; return
  }
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
  await fetch(`${API_URL}/reservas/${asigReservaId.value}/extras/${extraId}`, {
    method: 'DELETE', headers: headers()
  })
  okMsg.value = 'Extra removido.'; cargarExtrasDeReserva()
}

// ── MULTAS ────────────────────────────────────────────────────────────────────
const mReservaId  = ref('')
const mFechaReal  = ref('')
const mTarifa     = ref('')
const mNotas      = ref('')
const mEditandoId = ref(null)

const limpiarMulta = () => {
  mReservaId.value = ''; mFechaReal.value = ''; mTarifa.value = ''; mNotas.value = ''; mEditandoId.value = null
}

// Preview de días de atraso
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
    body: JSON.stringify({
      reserva_id: Number(mReservaId.value),
      fecha_devolucion_real: mFechaReal.value,
      tarifa_por_dia: Number(mTarifa.value),
      notas: mNotas.value || null
    })
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
    body: JSON.stringify({
      fecha_devolucion_real: mFechaReal.value,
      tarifa_por_dia: Number(mTarifa.value),
      notas: mNotas.value || null
    })
  })
  const data = await r.json()
  if (!r.ok) { errorMsg.value = data.message || 'Error al actualizar multa.'; return }
  okMsg.value = 'Multa actualizada.'; limpiarMulta(); cargarMultas()
}

const marcarPagada = async (m) => {
  limpiarMensajes()
  const r = await fetch(`${API_URL}/multas/${m.id}`, {
    method: 'PUT', headers: jsonHeaders(),
    body: JSON.stringify({ estado: 'pagada' })
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

// ── RESUMEN ───────────────────────────────────────────────────────────────────
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
  cargarExtras()
  cargarMultas()
  cargarReservas()
})
</script>
